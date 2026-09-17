# Rydle

A static daily Survivor Twin Cities castaway guessing game.

## Features
- 136 appearance entries from full-length Seasons 1–8
- Daily mode with a deterministic answer shared by all players
- Practice mode with unlimited random games
- 8 guesses
- Saved daily progress via localStorage
- Daily win %, current streak, max streak, and guess distribution
- Shareable spoiler-free emoji results
- Responsive mobile/desktop layout
- No backend, account, database, build step, or dependencies required

## Run locally
Open `index.html` in a browser. For the most browser-consistent behavior, serve the folder with any simple local web server.

## Deploy with GitHub Pages
1. Create a GitHub repository (for example `stcdle`).
2. Upload all files in this folder to the repository root.
3. In GitHub: Settings → Pages.
4. Under Build and deployment, choose `Deploy from a branch`.
5. Select `main` and `/ (root)`, then Save.
6. GitHub will provide the public URL.

## Deploy with Netlify
Drag this entire folder into Netlify's manual deploy area. No build command is required.

## Daily puzzle behavior
`game.js` contains `LAUNCH='2026-09-16'`. Puzzle #1 begins on that local calendar date. Answers come from a fixed seeded shuffle of all 136 appearances, so the daily sequence is stable but not obvious from database order. After 136 puzzles the sequence repeats.

Change `LAUNCH` before publishing if you want a different official launch date. Once people begin playing, avoid changing the launch date, seed string, player ordering, or answer-selection logic, because doing so changes historical puzzle answers.

## Editing the database
Edit `players.js`. Each appearance is stored with name, placement, gender, starting tribe, starting tribe color, and season. Returnee status is derived from the known S6 and S8 structure.

## Important data rules
- Mini/one-day seasons are excluded.
- Starting tribe color is used, not swap or merge tribe color.
- Returnee status belongs to a person, not an appearance.
- Returnee appearances are separate guessable entries.
