import config from '../data/config.json'
import { el, button, show, fill } from '../ui.js'
import { passScore } from '../scoring.js'

export function gameSelectScreen(games, onPick) {
  show(
    el('h2', { className: 'card' }, config.text.selectTitle),
    ...games.map((game) => {
      const rule = fill(config.text.winRule, {
        passScore: passScore(game.maxScore),
        max: game.maxScore,
      })
      const choice = button('', () => onPick(game), 'choice')
      choice.append(el('strong', {}, game.name), el('span', {}, rule))
      return choice
    }),
  )
}
