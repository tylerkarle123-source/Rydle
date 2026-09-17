# Rydle

A static daily Survivor Twin Cities castaway-appearance guessing game.

## Modes
- **Daily (Classic):** the original full-length Seasons 1–8 database. Its launch date, player ordering, seed, localStorage keys, and answer sequence are preserved.
- **Practice:** unlimited random Classic games.
- **Hard:** every STC event through Season 8.75, including S3.5, S4.5, S6.5, S7.5, S8.25, S8.5, and S8.75. Hard has its own daily answer sequence, saved progress, and statistics.

## Hard rules
Hard uses seven clues: Castaway, Season, Place, Gender, Color, Returnee, Format.
- Season proximity follows event chronology: S8 → S8.25 → S8.5 → S8.75. Adjacent events are yellow.
- Placement exact matches are green; within two places is yellow. Tied 2nd/3rd finishes are stored as a tied range and display as `2nd/3rd`.
- Color is starting-tribe color only.
- Returnee is player-level within the relevant database: a player with multiple included appearances is Yes on every appearance.
- Format is `Full` or `Mini`.
- Eight guesses in all modes.

## Files
- `players.js` — Classic 136-appearance database.
- `players-hard.js` — Hard mini/one-day data plus construction of the combined Hard database.
- `game.js` — Classic, Practice, and Hard game logic.
- `index.html` — UI.
- `style.css` — responsive styling, including the seven-column Hard board.

## Deploy to GitHub Pages
Replace/update the files in the repository root with these files, including the new `players-hard.js`, and commit to `main`. GitHub Pages will redeploy the same public URL.

**Important:** do not change the Classic launch date (`2026-09-16`), Classic seed (`STCdle-S1-S8-v1`), or Classic player ordering after publication. Those preserve historical Classic daily answers.
