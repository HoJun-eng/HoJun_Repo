// The server is already set up: `npm start` runs it alongside the app.
// The app talks to it through src/api.js. You only need to fill in the TODOs.
import express from 'express'
import fs from 'node:fs'

const DATA_DIR = new URL('./data/', import.meta.url)
const DATA_FILE = new URL('records.json', DATA_DIR)
const CONFIG_FILE = new URL('./src/data/config.json', import.meta.url)
const RECORD_TYPES = ['player', 'pick', 'result', 'win', 'final_view']

function readRecords() {
  if (!fs.existsSync(DATA_FILE)) return []
  // A damaged file throws here, so it is never silently overwritten.
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
}

function writeRecords(records) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  // Write a temporary file first so a crash can't leave a half-written one.
  const temp = new URL('records.tmp', DATA_DIR)
  fs.writeFileSync(temp, JSON.stringify(records, null, 2))
  fs.renameSync(temp, DATA_FILE)
}

const app = express()
app.use(express.json()) // lets the server read JSON sent by the app

// Lets the starter screen check the server is running. Safe to remove.
app.get('/api/ping', (req, res) => {
  res.json({ ok: true })
})

// Save one record sent by the app. Wins also get the next prize number.
// The file work is synchronous, so two phones can't be given the same number.
app.post('/api/records', (req, res) => {
  const { type, requestId } = req.body ?? {}
  if (!RECORD_TYPES.includes(type) || !requestId) {
    return res.status(400).json({ error: 'Unknown type or missing requestId' })
  }

  const records = readRecords()
  // If the app retries the same request, return what was already saved.
  const existing = records.find((r) => r.requestId === requestId)
  if (existing) return res.json(existing)

  const record = { ...req.body, savedAt: new Date().toISOString() }
  if (type === 'win') {
    const { prizeId } = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'))
    record.winNumber = records.filter((r) => r.type === 'win').length + 1
    record.prizeId = prizeId.prefix + String(record.winNumber).padStart(prizeId.digits, '0')
  }
  writeRecords([...records, record])
  res.json(record)
})

// Send all saved records back to the app.
app.get('/api/records', (req, res) => {
  res.json(readRecords())
})

// Change these routes or add your own if you prefer.

app.listen(3001, () => console.log('Server running on http://localhost:3001'))
