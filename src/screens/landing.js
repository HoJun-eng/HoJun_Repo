import config from '../data/config.json'
import { el, button, show } from '../ui.js'

export function landingScreen(onStart) {
  show(
    el('div', { className: 'card' },
      el('h1', {}, config.text.landingTitle),
      el('p', {}, config.text.landingSubtitle)),
    button(config.text.startButton, onStart),
  )
}
