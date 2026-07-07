#!/bin/bash
# Auto-pull notes-vault for Obsidian
# Log output to /tmp/notes-vault-pull.log
VAULT="/Users/wangzhecheng/Documents/Public Vault"
export GIT_SSH_COMMAND="ssh -i $HOME/.ssh/id_ed25519 -o StrictHostKeyChecking=accept-new -o PasswordAuthentication=no"

cd "$VAULT" || exit 1
echo "$(date '+%Y-%m-%d %H:%M:%S') → pulling..."
git pull --rebase 2>&1
echo "---"
