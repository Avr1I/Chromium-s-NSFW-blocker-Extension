# NSFW Defender — Chromium Extension

A Chromium browser extension that automatically detects and blurs NSFW video content on YouTube in real time, using an in-browser machine learning model (no server, no data leaves the browser).

## Overview

- Runs entirely client-side using [nsfwjs](https://github.com/infinitered/nsfwjs) (built on TensorFlow.js)
- Periodically grabs a frame from the currently playing YouTube video and classifies it
- Blurs the video (`blur(70px)`) when the classifier flags the frame as NSFW
- Toggle the defender ON/OFF from a simple popup

## How it works

1. **Content script (`contents.js`)** is injected into every `https://www.youtube.com/*` page.
2. On load, it loads the bundled `nsfwjs` model (`Model/model.json` + weights) and starts a loop that runs every 300 ms while the defender is active.
3. Each cycle, it draws the current video frame onto an off-screen `<canvas>` and classifies it with the model.
4. If any of the following predictions exceed their threshold, the frame is considered NSFW:
   - `Porn` ≥ 0.77
   - `Hentai` ≥ 0.5
   - `Sexy` ≥ 0.5
5. When NSFW content is detected, a strong blur is applied to the `<video>` element; otherwise the blur is removed.
6. **Popup (`extension.html` / `popup.js`)** provides two buttons, ON and OFF, which send a `chrome.runtime` message to the active tab's content script to toggle detection.

## Tech stack

- Manifest V3 Chrome extension
- [TensorFlow.js](https://www.tensorflow.org/js) (`tf.js`)
- [nsfwjs](https://github.com/infinitered/nsfwjs) (`nsfwjs.min.js`) with a bundled classification model (`EXTENSION/Model/`)
- Vanilla JavaScript, HTML, CSS (no build step, no framework)

## Installation (load as an unpacked extension)

1. Clone the repository:
   ```bash
   git clone https://github.com/Avr1I/Chromium-s-NSFW-blocker-Extension-for-movies.git
   ```
2. Open Chromium/Chrome and go to `chrome://extensions`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the `EXTENSION` folder (not the repo root).
5. The "NSFW defender" extension icon should appear in the toolbar.

## Usage

1. Open a video on YouTube.
2. Click the extension icon to open the popup.
3. Click **ON** to start monitoring the current tab, or **OFF** to stop it.
4. If NSFW content is detected in the video frame, it will be blurred automatically until the content changes.

## Project structure

```
Chromium-s-NSFW-blocker-Extension-for-movies/
└── EXTENSION/
    ├── manifest.json         # Extension manifest (V3), permissions and content script config
    ├── contents.js           # Injected into YouTube pages: frame capture + classification + blur
    ├── popup.js              # Popup logic: sends ON/OFF messages to the content script
    ├── extension.html        # Popup markup
    ├── extension.css         # Popup styling
    ├── tf.js                 # TensorFlow.js library
    ├── nsfwjs.min.js         # nsfwjs classification library
    └── Model/
        ├── model.json        # Model architecture/config
        └── group1-shard1of1  # Model weights
```

## Known limitations

- Only active on `https://www.youtube.com/*` — it won't work on other video sites.
- Detection thresholds are hardcoded in `contents.js` and not configurable from the UI.
- Classifying a frame every 300 ms may briefly show unblurred frames right after content changes, before the next classification runs.
- The defender's ON/OFF state is not persisted: it resets (defender is OFF) whenever the content script reloads (e.g., page refresh or new tab).
- No automated tests; the project itself is flagged by the author as still needing adjustments.
