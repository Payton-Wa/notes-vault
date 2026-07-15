#!/usr/bin/env node

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ALBUM_DIR = resolve(SCRIPT_DIR, '..');
const ASSETS_DIR = join(ALBUM_DIR, 'assets');
const STATE_FILE = join(SCRIPT_DIR, 'pailixiang-state.json');
const AUTO_DATA_FILE = join(ASSETS_DIR, 'usa-auto-photos.js');
const CACHE_DIR = process.env.PAILIXIANG_CACHE_DIR || join(homedir(), '.cache', 'forcome-pailixiang');
const ALBUM_CODE = '13014230324';
const APP_KEY = '1e3a58fb24de413c9873542fc5667a25';
const API_ROOT = 'https://mapi.pailixiang.com/plx';
const PAGE_URL = `https://live.pailixiang.com/album/a${ALBUM_CODE}?from=timeline`;
const MAX_CANDIDATES = 24;

function authFields() {
  const chars = Array.from(APP_KEY);
  let prefix = '';
  for (let index = 0; index < 3; index += 1) {
    const digit = Math.floor(Math.random() * 10);
    prefix += digit;
    chars[digit + 15] = chars[digit];
  }
  return { tt: '', ct: 0, cv: '167', lang: 'cn', pid: 'albumview', ak: prefix + chars.join('') };
}

async function postApi(endpoint, payload) {
  const response = await fetch(`${API_ROOT}${endpoint}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=utf-8',
      origin: 'https://live.pailixiang.com',
      referer: PAGE_URL,
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36',
    },
    body: JSON.stringify({ ...payload, ...authFields() }),
  });
  if (!response.ok) throw new Error(`${endpoint} returned HTTP ${response.status}`);
  const result = await response.json();
  if (result.Code !== 0) throw new Error(`${endpoint}: ${result.Msg || `Code ${result.Code}`}`);
  return result;
}

function normalizePhoto(photo) {
  return {
    id: photo.ID,
    name: photo.Name || photo.FileName || photo.ID,
    shootTime: photo.ShootTime || '',
    width: Number(photo.Width) || 0,
    height: Number(photo.Height) || 0,
    fileSize: Number(photo.FileSize1 || photo.FileSize) || 0,
    imageUrl: photo.ImageUrl,
    bigImageUrl: photo.BigImageUrl || photo.ImageUrl,
  };
}

async function fetchAlbumPhotos() {
  const view = await postApi('/WapAbm/AlbumGetView', {
    ID: ALBUM_CODE,
    AccessType: '1',
    SourceType: 'timeline',
    Nw: '',
    ClientType: 0,
  });
  const entity = view.Data?.Entity;
  if (!entity?.ID) throw new Error('Album metadata did not include an album ID');

  const pageSize = Math.min(Number(view.Data.PhotoSearchCount) || 80, 100);
  const photos = [];
  let startIndex = 1;
  let optTime = '';
  let totalCount = Infinity;
  while (photos.length < totalCount) {
    const page = await postApi('/WapAbm/AlbumSearchPhoto', {
      AlbumID: entity.ID,
      GroupID: '',
      SearchType: 0,
      IsPayDownload: false,
      PhotoSortType: Number(entity.PhotoSortType) || 1,
      IsNw: false,
      IsEmbed: false,
      StartIndex: startIndex,
      SearchCount: pageSize,
      SortType: Number(entity.SortType) || 1,
      OptTime: optTime,
    });
    const items = Array.isArray(page.Data) ? page.Data : [];
    totalCount = Number(page.TotalCount) || items.length;
    if (!optTime) optTime = page.OptTime || '';
    photos.push(...items.map(normalizePhoto));
    if (items.length === 0) break;
    startIndex += items.length;
  }
  return photos;
}

function scorePhoto(photo) {
  const pixels = Math.max(1, photo.width * photo.height);
  const ratio = photo.height ? photo.width / photo.height : 1;
  const landscape = ratio >= 1.25 && ratio <= 2 ? 4 : ratio >= 1 ? 2 : 0;
  const cameraFile = /^(IMG_|JPZ|DNY|DSC)/i.test(photo.name) ? 2 : 0;
  const resolution = Math.min(8, Math.log2(pixels / 1_000_000 + 1) * 3);
  const size = Math.min(4, Math.log2(photo.fileSize / 500_000 + 1) * 2);
  return landscape + cameraFile + resolution + size;
}

async function readState() {
  if (!existsSync(STATE_FILE)) return { version: 1, knownIds: [], importedIds: [], pending: {}, lastScanAt: null };
  return JSON.parse(await readFile(STATE_FILE, 'utf8'));
}

async function saveState(state) {
  state.knownIds = Array.from(new Set(state.knownIds)).sort();
  state.importedIds = Array.from(new Set(state.importedIds)).sort();
  await writeFile(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`);
}

function readArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : '';
}

function requestedIds() {
  const raw = readArg('--ids');
  return raw ? raw.split(',').map(value => value.trim()).filter(Boolean) : [];
}

async function download(url, destination) {
  const response = await fetch(url, { headers: { referer: PAGE_URL, 'user-agent': 'Mozilla/5.0' } });
  if (!response.ok) throw new Error(`Image download returned HTTP ${response.status}`);
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

async function readAutoPhotos() {
  if (!existsSync(AUTO_DATA_FILE)) return [];
  const source = await readFile(AUTO_DATA_FILE, 'utf8');
  const start = source.indexOf('[');
  const end = source.lastIndexOf(']');
  return start >= 0 && end > start ? JSON.parse(source.slice(start, end + 1)) : [];
}

async function saveAutoPhotos(photos) {
  const source = `window.FORCOME_USA_AUTO_PHOTOS = ${JSON.stringify(photos, null, 2)};\n`;
  await writeFile(AUTO_DATA_FILE, source);
}

async function bootstrap() {
  const photos = await fetchAlbumPhotos();
  const state = await readState();
  state.knownIds = photos.map(photo => photo.id);
  state.importedIds = (await readAutoPhotos()).map(photo => photo.sourceId).filter(Boolean);
  state.pending = {};
  state.lastScanAt = new Date().toISOString();
  await saveState(state);
  console.log(JSON.stringify({ status: 'bootstrapped', known: photos.length }, null, 2));
}

async function discover() {
  const photos = await fetchAlbumPhotos();
  const state = await readState();
  if (!state.knownIds.length && !process.argv.includes('--allow-empty-baseline')) {
    throw new Error('State is empty. Run the bootstrap command once before daily discovery.');
  }
  const known = new Set([...state.knownIds, ...state.importedIds]);
  const newPhotos = photos.filter(photo => !known.has(photo.id));
  for (const photo of newPhotos) state.pending[photo.id] = photo;
  state.knownIds.push(...photos.map(photo => photo.id));
  state.lastScanAt = new Date().toISOString();
  await saveState(state);

  const candidates = Object.values(state.pending)
    .filter(photo => photo.imageUrl && photo.width >= 1200 && photo.height >= 800)
    .sort((a, b) => scorePhoto(b) - scorePhoto(a) || b.shootTime.localeCompare(a.shootTime))
    .slice(0, MAX_CANDIDATES);

  await rm(CACHE_DIR, { recursive: true, force: true });
  await mkdir(CACHE_DIR, { recursive: true });
  const manifest = [];
  for (let index = 0; index < candidates.length; index += 1) {
    const photo = candidates[index];
    const preview = join(CACHE_DIR, `${String(index + 1).padStart(2, '0')}-${photo.id}.jpg`);
    await download(photo.imageUrl, preview);
    manifest.push({ ...photo, score: Number(scorePhoto(photo).toFixed(2)), preview });
  }
  const manifestPath = join(CACHE_DIR, 'manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(JSON.stringify({ status: 'discovered', newCount: newPhotos.length, pendingCount: Object.keys(state.pending).length, candidateCount: manifest.length, manifestPath, cacheDir: CACHE_DIR }, null, 2));
}

async function importPhotos() {
  const selectionPath = readArg('--selection');
  let selections = requestedIds().map(id => ({ id }));
  if (selectionPath) selections = JSON.parse(await readFile(resolve(selectionPath), 'utf8'));
  if (!Array.isArray(selections) || selections.length === 0) throw new Error('Provide --ids id1,id2 or --selection selection.json');

  const state = await readState();
  const currentPhotos = new Map((await fetchAlbumPhotos()).map(photo => [photo.id, photo]));
  const existing = await readAutoPhotos();
  const existingIds = new Set(existing.map(photo => photo.sourceId));
  const imported = [];
  await mkdir(ASSETS_DIR, { recursive: true });

  for (const selection of selections) {
    const photo = state.pending[selection.id] || currentPhotos.get(selection.id);
    if (!photo || existingIds.has(selection.id)) continue;
    const date = (photo.shootTime || new Date().toISOString()).slice(0, 10).replaceAll('-', '');
    const extension = ['.jpg', '.jpeg', '.png'].includes(extname(new URL(photo.bigImageUrl).pathname).toLowerCase()) ? extname(new URL(photo.bigImageUrl).pathname).toLowerCase() : '.jpg';
    const fileName = `usa-live-${date}-${photo.id.slice(0, 8)}${extension}`;
    await download(photo.bigImageUrl, join(ASSETS_DIR, fileName));
    imported.push({
      sourceId: photo.id,
      src: `assets/${fileName}`,
      shootTime: photo.shootTime,
      captionZh: selection.captionZh || `美国模块现场记录 · ${photo.shootTime.slice(0, 10)}`,
      captionEn: selection.captionEn || `USA module on site · ${photo.shootTime.slice(0, 10)}`,
      altZh: selection.altZh || '美国模块现场照片',
      altEn: selection.altEn || 'USA module photo',
    });
    state.importedIds.push(photo.id);
    delete state.pending[photo.id];
  }
  await saveAutoPhotos([...imported, ...existing]);
  await saveState(state);
  console.log(JSON.stringify({ status: 'imported', importedCount: imported.length, files: imported.map(photo => photo.src) }, null, 2));
}

async function dismiss() {
  const state = await readState();
  const ids = process.argv.includes('--all') ? Object.keys(state.pending) : requestedIds();
  for (const id of ids) delete state.pending[id];
  await saveState(state);
  console.log(JSON.stringify({ status: 'dismissed', count: ids.length, pendingCount: Object.keys(state.pending).length }, null, 2));
}

async function status() {
  const state = await readState();
  console.log(JSON.stringify({ knownCount: state.knownIds.length, importedCount: state.importedIds.length, pendingCount: Object.keys(state.pending).length, lastScanAt: state.lastScanAt, stateFile: STATE_FILE, cacheDir: CACHE_DIR }, null, 2));
}

const command = process.argv[2];
const commands = { bootstrap, discover, import: importPhotos, dismiss, status };
if (!commands[command]) {
  console.error('Usage: sync-pailixiang.mjs <bootstrap|discover|import|dismiss|status> [options]');
  process.exit(2);
}

commands[command]().catch(error => {
  console.error(error.stack || error.message);
  process.exit(1);
});
