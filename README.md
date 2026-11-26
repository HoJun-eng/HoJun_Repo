# Play & Win: starter project

A blank app for the Ransack take-home. Build a working **mobile** demo of the app in the **[client brief](client-brief.pdf)**.

**Deadline:** Sunday, 23:59.

**Required (minimum viable product):**

- **The full flow**, from the Landing Screen to the Final Screen, working on a phone.
- **Keep it flexible.** Keep all settings (questions, pass mark, game limits, text) in one place, and tell us where in your notes. We'll test changing them.

**Strongly recommended next step: data collection and the Admin Screen.** Save what happens in the app and show the stats on the Admin Screen. The server is already set up for you. See [Saving data](#saving-data).

Everything else is extra. AI for code is fine (and encouraged). Please don't use AI-generated images or artwork.

## Setup

1. Click **Use this template → Create a new repository** and make it **public**. Please don't fork. Email the link to your repo to **chase@ransack.sg** as soon as you've created it, so we can follow your progress.
2. Clone your new repo and install [Node.js](https://nodejs.org) 20.19 or newer.
3. In the project folder, run:

   ```bash
   npm install
   npm start
   ```

4. Open `http://localhost:5173`. You should see **"Setup works!"** and **"Server connected ✓"**.

`npm start` runs both the app and the server. Always use it to run the project.

## Testing on mobile

Use either option. Testing on a real phone is best if you can.

**Option A: your phone**

1. With `npm start` running, look for the **Network** address it prints (e.g. `http://192.168.1.23:5173`).
2. Open that address on a phone connected to the **same Wi-Fi**.
3. Can't connect? On Windows, allow Node.js through the firewall. Some Wi-Fi networks block this, so try your phone's hotspot instead.

**Option B: browser developer tools**

1. With `npm start` running, open the app in Chrome or Edge.
2. Press **F12** (Mac: **Cmd + Option + I**), then click the **phone/tablet icon** (or press **Ctrl + Shift + M**).
3. Pick a phone (e.g. iPhone 14) from the dropdown at the top.

## Saving data

A browser can't write files on a computer, so the app sends data to a small **server** that runs on your computer, and the server saves it. This is already set up. You just fill in the blanks.

```
Phone ──▶ app (port 5173) ──▶ /api/... ──▶ server.js (port 3001) ──▶ your file
```

**Fill in:**

- **`src/api.js`:** `saveRecord(record)` and `getRecords()`. Your app calls these, the same way you'd use a database service.
- **`server.js`:** the two `/api/records` routes, which save records to a file and send them back.

**You decide:**

- **How to save:** when the app should save, and what gets saved.
- **The format:** what one record looks like, and the file format (e.g. CSV, JSON, or another format you prefer).
- **How to retrieve:** how the Admin Screen gets the records and turns them into the stats in the brief.

Every phone must save to the **same file on your computer**, not each phone's own storage. Use a local file, not a hosted database (e.g. Supabase, Firebase). Node's built-in [`fs`](https://nodejs.org/api/fs.html) module can read and write files. Change the functions and routes, or add your own, if you prefer.

## What's inside

```
client-brief.pdf         What the client wants
public/bg.png            Background image
server.js                The server (fill in the save/load routes)
vite.config.js           Connects the app to the server (no changes needed)
src/api.js               saveRecord() and getRecords() for your app to call
src/main.js              App entry point (placeholder screen)
src/style.css            Global styles
src/data/questions.json  The quiz questions
```

Questions can have any number of options. Each question has an `answerIndex`: the position of the correct option, counting from 0.

```json
{ "question": "Which of these is a fruit?", "options": ["Carrot", "Tomato"], "answerIndex": 1 }
```

You can use any framework or library, as long as `npm install` and `npm start` still run everything.

## Your notes

Replace this section before you submit.

- **Where to change the settings:**
  - `src/data/config.json`: pass mark (`passPercent`), questions per round (`quiz.questionsPerRound`, 0 = all), player form options, prize ID format, mini-game plate count, timings, foods and image paths (`miniGame`), and screen text (`text`).
  - `src/data/questions.json`: the quiz questions, options and correct answers.
  - To keep the longest mini-game under 1 minute, `plates` × (`secondsPerPlate` + `reactionSeconds`) should be below 60.

- **How saving and loading works, and why I chose that format** (or why I left it out):
  The app records player details, game picks, results, prizes and Final Screen views, and sends them to `server.js`, which saves them in `data/records.json`. The Admin Screen (add `#admin` to the app address) loads these records, calculates the stats and refreshes every 10 seconds. I used JSON because it works directly with JavaScript and handles records with different fields, such as a list of age ranges. The server issues prize numbers so that two phones don't get the same one. If the server is unreachable, statistics wait on the phone and are resent while the app is open, and a winner can retry to get their prize ID.

- **Assumptions I made:**
  - Names, group size, age range are acceptable to be collected, so privacy isn't violated
  - The number of players is shown both as player groups (forms submitted) and people (total group size).
  - Each win gets 1 prize ID, and the group cannot get the prize again as their phone will be stuck on that screen. But if they were to use a different phone, then they will be able to bypass this to claim multiple prizes
  - The prize ID is only unique to the user phone

- **What I prioritised, and why:**
  - The full flow on mobile came first because it is the minimum requirement, followed by the custom mini-game, then data collection and the Admin Screen. I kept the controls large and simple for players of all ages, and kept settings easy to change for future events. Prize IDs are running numbers (e.g. #W00001) so they are easy for counter staff to read and show how many prizes have been issued.

- **What I left out or didn't finish, and why:**
  - A limit of one prize per phone. I wanted a phone that has already won to be unable to claim another prize, but this isn't in the current version. Refreshing the winning screen keeps the same prize ID, but after tapping "Prize collected", or opening the app in a new tab, a player can play and win again. Players using a different phone could still win again, which I accept as I can't reliably prevent it.
  - No password on the Admin Screen. A real event would need a login checked by the server.

- **Time planned vs. time spent:**
  - Around 2 to 3 hours

- **How I used AI** (and one suggestion I changed or didn't use):
  - I planned the screen flow and designed the mini-game, and used Claude (an AI assistant) to assist in writing the code and test the app. One suggestion I changed: it first used random prize codes, and I changed these to running numbers to make wins easier to track.

- **Anything I'm unsure about:**
  - I was unsure on whether the game must be related to the mascot or event itself, so I decided to use Ransack's mascot (I apologise for it being badly drawn) as part of the game
