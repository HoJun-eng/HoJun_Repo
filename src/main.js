// App entry point: decides which screen comes next.
import './style.css'
import { saveRecord, track, newId } from './api.js'
import { quiz } from './games/quiz.js'
import { miniGame } from './games/miniGame.js'
import { passScore } from './scoring.js'
import { landingScreen } from './screens/landing.js'
import { playerFormScreen } from './screens/playerForm.js'
import { gameSelectScreen } from './screens/gameSelect.js'
import { adminScreen } from './screens/admin.js'
import { loseScreen, savingScreen, winScreen } from './screens/result.js'

const games = [quiz, miniGame]
const WIN_KEY = 'playAndWin.currentWin'
let player = null

function start() {
  player = null
  landingScreen(() =>
    playerFormScreen((details) => {
      player = { ...details, playerId: newId() }
      track('player', player)
      selectGame()
    }),
  )
}

function selectGame() {
  gameSelectScreen(games, (game) => {
    track('pick', { playerId: player.playerId, game: game.id })
    playGame(game)
  })
}

function playGame(game) {
  game.play((score) => finishGame(game, score))
}

function finishGame(game, score) {
  const max = game.maxScore
  const needed = passScore(max)

  const won = score >= needed
  track('result', { playerId: player.playerId, game: game.id, score, max, won })

  if (!won) {
    loseScreen({ score, max, passScore: needed }, () => playGame(game), selectGame)
    return
  }

  claimPrize({
    type: 'win',
    // Identifies this win, so retrying never uses up a second number.
    requestId: newId(),
    playerId: player.playerId,
    nickname: player.nickname,
    groupSize: player.groupSize,
    ageRanges: player.ageRanges,
    game: game.name,
    score,
    max,
  })
}

async function claimPrize(win) {
  // Remember the win so a page refresh doesn't lose it.
  sessionStorage.setItem(WIN_KEY, JSON.stringify(win))
  if (win.prizeId) return showWin(win)

  savingScreen()
  try {
    const saved = await saveRecord(win)
    sessionStorage.setItem(WIN_KEY, JSON.stringify(saved))
    showWin(saved)
  } catch {
    savingScreen(() => claimPrize(win))
  }
}

function showWin(win) {
  // Counted every time the Final Screen appears, including after a refresh.
  track('final_view', { prizeId: win.prizeId })
  winScreen(win, () => {
    sessionStorage.removeItem(WIN_KEY)
    start()
  })
}

// Staff open the Admin Screen by adding #admin to the app's address.
window.addEventListener('hashchange', () => location.reload())

const savedWin = sessionStorage.getItem(WIN_KEY)
if (location.hash === '#admin') adminScreen(games)
else if (savedWin) claimPrize(JSON.parse(savedWin))
else start()
