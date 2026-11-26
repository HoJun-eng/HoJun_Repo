// Your app's connection to the "database" (the server in server.js).
// Use these from your screens, the same way you'd use a database service.

// Call this whenever something worth recording happens.
// Returns the saved record, and throws if it could not be saved.
export async function saveRecord(record) {
  const res = await fetch('/api/records', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`Save failed (${res.status})`)
  return res.json()
}

// Identifies one record, so sending it twice never saves it twice.
// (crypto.randomUUID doesn't work on a phone using an http:// network address.)
export function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

// Records waiting to be sent are kept on the phone until the server has them.
const QUEUE_KEY = 'playAndWin.unsent'
let queue = []
try {
  queue = JSON.parse(localStorage.getItem(QUEUE_KEY)) ?? []
} catch {
  // Storage is unavailable: the queue only lasts while the page is open.
}
let sending = false

function keepQueue() {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  } catch {
    // See above.
  }
}

async function sendQueued() {
  if (sending) return
  sending = true
  try {
    while (queue.length) {
      await saveRecord(queue[0])
      queue.shift()
      keepQueue()
    }
  } catch {
    // Server unreachable: try again later without interrupting the player.
  } finally {
    sending = false
  }
}

// Save a statistic in the background.
export function track(type, details) {
  queue.push({ ...details, type, requestId: newId(), happenedAt: new Date().toISOString() })
  keepQueue()
  sendQueued()
}

setInterval(sendQueued, 5000)
sendQueued()

// Call this from the Admin Screen to get everything that was saved.
export async function getRecords() {
  const res = await fetch('/api/records')
  if (!res.ok) throw new Error(`Load failed (${res.status})`)
  return res.json()
}

// Change these functions or add your own if you prefer.
