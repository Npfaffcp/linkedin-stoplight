# LinkedIn Stoplight

Chrome extension for recruiters. Tracks candidates you've already spoken to so you don't waste time reaching out twice.

## How It Works

- **Green light** = New candidate (haven't spoken to them)
- **Red light** = Already contacted (you saved their name previously)

When you browse LinkedIn profiles, the extension automatically checks the profile name against your saved list. If there's a match, a red banner appears at the top of the page with a pulsing red dot.

## Features

- Stoplight popup with name input bar
- Paste a candidate name and hit Save after you speak with them
- Persistent storage (survives browser restarts)
- Auto-detection on LinkedIn profile pages
- Red banner overlay on matched profiles
- Badge indicator on the extension icon
- SPA navigation support (works as you click between LinkedIn profiles)
- Delete candidates from your list

## Setup

1. Clone this repo:
```bash
git clone https://github.com/Npfaffcp/linkedin-stoplight.git
cd linkedin-stoplight
```

2. Generate the icons:
```bash
python3 generate_icons.py
```

3. Load in Chrome:
   - Go to `chrome://extensions/`
   - Enable **Developer mode** (top right toggle)
   - Click **Load unpacked**
   - Select the `linkedin-stoplight` folder

4. Pin the extension to your toolbar for quick access.

## Usage

1. After speaking with a candidate, click the extension icon
2. Paste their full name into the input bar
3. Click **Save**
4. Next time you land on their LinkedIn profile, the light turns red

## Files

| File | Purpose |
|------|--------|
| `manifest.json` | Extension configuration (MV3) |
| `popup.html/css/js` | Extension popup UI |
| `content.js/css` | LinkedIn page injection + detection |
| `background.js` | Service worker for badge management |
| `generate_icons.py` | Script to generate extension icons |
