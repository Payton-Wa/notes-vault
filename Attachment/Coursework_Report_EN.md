# CAN202 Coursework Report Answers (English Version)

## Part 1: DSB-SC AM Analysis

### a) Carrier Frequency Selection and Justification
The carrier frequency for DSB-SC modulation is set at $f_{c_1} = 20000$ Hz. This selection is justified as it satisfies the condition $f_{c_1} \gg B_w$, where $B_w \approx 4096$ Hz represents the message signal bandwidth. This ensures a sufficient guard band between the two spectral lobes and prevents overlap at DC. The frequency spectrum plotted in the simulation confirms that the modulated signal is centered at $\pm 20$ kHz without aliasing.

### b) Effects of Omitting Upsampling
If upsampling is not performed, the system sampling rate remains at the original $F_s = 8192$ Hz. Since the chosen carrier frequency $f_{c_1} = 20000$ Hz exceeds the Nyquist frequency ($F_s/2 = 4096$ Hz), the discrete-time carrier signal experiences severe frequency aliasing. This causes the modulated signal to fold back into the baseband, resulting in a distorted spectrum where the original message information is irretrievably lost.

### c) Implementation of Coherent Detection
Coherent detection is achieved by multiplying the received DSB-SC signal by a local replica of the carrier, $\cos(2\pi f_{c_1}t)$. This operation shifts the signal components back to the baseband and to a double-frequency term ($2f_{c_1}$). A FIR low-pass filter, designed using the provided `design_fir_filter` function, is then applied to suppress the high-frequency components. The signal is subsequently normalized and resampled to the original rate for audio verification.

### d) Impact of Carrier Phase and Frequency Mismatch
Experimental results demonstrate that a frequency offset $\Delta f$ introduces a "beating" effect, where the demodulated signal's amplitude fluctuates periodically, causing audible distortion. Conversely, a phase offset $\theta$ results in a constant attenuation of the demodulated signal amplitude by a factor of $\cos(\theta)$. As $\theta$ approaches $\pi/2$ radians, the output signal power vanishes entirely.

## Part 2: FM Analysis

### e) FM Modulation Strategy
Frequency modulation is implemented with a frequency sensitivity of $\beta = 20000$ and a carrier $f_{c_2} = 50000$ Hz. To ensure numerical stability, the integration-differentiation round-trip was verified using `cumtrapz` and `diff` functions, confirming that the message signal could be perfectly reconstructed. To prevent aliasing of the wideband FM signal, the sampling frequency was increased to $F_{s\_FM} = 200000$ Hz.

### f) 95% Effective Bandwidth Evaluation
The 95% effective bandwidth is determined to be approximately 48–50 kHz. This value is justified using Carson’s Rule, calculated as $BW \approx 2(\Delta f + B_w) = 2(20000 + 4096) = 48192$ Hz. This is further validated through spectral visualization and power accumulation analysis, which shows that 95% of the total signal power is contained within this frequency range.

### g) FM Demodulator Components
The FM demodulator consists of a hard-limiter to remove amplitude variations, followed by a differentiator to convert frequency deviations into amplitude variations. An envelope detector (comprising an absolute value operation and a low-pass filter) extracts the message, and a DC-removal stage restores the original signal profile. Successful recovery was verified by listening to the output audio.

## Part 3: Noise Performance and Comparison

### h) Bandpass Filter Specification
Receiver front-end bandpass filters are designed to minimize noise power without distorting the signal. For DSB-SC AM, the bandwidth is set to $2B_w = 8192$ Hz centered at $f_{c_1}$. For FM, the bandwidth is set slightly wider than the Carson bandwidth (approx. 53 kHz) centered at $f_{c_2}$ to accommodate the significant sidebands. Both configurations were verified to produce high-quality recovered audio.

### i) & j) AWGN Simulation and SNR Calculation
Noise samples were added to achieve a 10 dB SNR at the AM bandpass filter output. For a fair comparison, the FM system was tested using the same noise power spectral density (PSD). Following the Appendix guidelines, the output SNR was calculated by comparing the noise-corrupted demodulated signal with a "pure" demodulated signal obtained from a noiseless simulation.

### k) Comparative Discussion
The comparison reveals that the FM system achieves a significantly higher output SNR than the DSB-SC AM system under identical noise PSD conditions. This "FM gain" is attributed to the wideband nature of frequency modulation, which trades increased bandwidth for improved noise immunity. Additionally, the hard-limiter in the FM receiver effectively suppresses additive amplitude noise, a benefit not available in the linear AM system.
