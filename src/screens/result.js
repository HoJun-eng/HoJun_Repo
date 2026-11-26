import config from '../data/config.json'
import { el, button, show, fill } from '../ui.js'

export function loseScreen({ score, max, passScore }, onRetry, onBack) {
  show(
    el('div', { className: 'card' },
      el('h1', {}, config.text.loseTitle),
      el('p', {}, fill(config.text.loseMessage, { score, max, passScore }))),
    button(config.text.retryButton, onRetry),
    button(config.text.otherGameButton, onBack, 'secondary'),
  )
}

// Shown while the server is issuing the prize ID. Pass onRetry after a failure.
export function savingScreen(onRetry) {
  show(
    el('div', { className: 'card' },
      el('h1', {}, config.text.winTitle),
      el('p', { role: 'status' }, onRetry ? config.text.saveError : config.text.savingWin)),
    ...(onRetry ? [button(config.text.saveRetryButton, onRetry)] : []),
  )
}

export function winScreen(win, onDone) {
  show(
    el('div', { className: 'card' },
      el('h1', {}, config.text.winTitle),
      el('p', {}, config.text.winMessage),
      el('p', {}, config.text.prizeIdLabel),
      el('p', { className: 'prize-id' }, win.prizeId),
      el('p', {}, win.nickname),
      el('p', {}, fill(config.text.winScore, win))),
    button(config.text.doneButton, () => {
      if (window.confirm(config.text.doneConfirm)) onDone()
    }, 'secondary'),
  )
}
