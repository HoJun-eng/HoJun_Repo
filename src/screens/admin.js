import config from '../data/config.json'
import { getRecords } from '../api.js'
import { summarise } from '../stats.js'
import { el, button, show, fill } from '../ui.js'

const { text } = config

function table(headings, rows) {
  return el('table', {},
    el('thead', {}, el('tr', {}, ...headings.map((h) => el('th', {}, h)))),
    el('tbody', {}, ...rows.map((row) =>
      el('tr', {}, ...row.map((cell) => el('td', {}, String(cell)))))))
}

export function adminScreen(games) {
  const status = el('p', { className: 'card small', role: 'status' })
  const content = el('div', { className: 'admin' })

  const load = async () => {
    try {
      const stats = summarise(await getRecords(), games)
      const tiles = [
        [text.adminGroups, stats.groups],
        [text.adminPeople, stats.people],
        [text.adminPrizes, stats.prizes.length],
        [text.adminViews, stats.finalViews],
      ]
      content.replaceChildren(
        el('div', { className: 'tiles' }, ...tiles.map(([label, value]) =>
          el('div', { className: 'card' }, el('strong', {}, String(value)), el('span', {}, label)))),
        el('div', { className: 'card' },
          table(
            [text.adminGame, text.adminPicked, text.adminWins, text.adminLosses],
            stats.games.map((g) => [g.name, g.picked, g.wins, g.losses]))),
        el('div', { className: 'card' },
          el('h2', {}, text.adminPrizeList),
          stats.prizes.length
            ? el('ul', {}, ...stats.prizes.map((p) =>
                el('li', {},
                  el('strong', {}, p.prizeId),
                  ` ${p.nickname} · ${new Date(p.savedAt).toLocaleTimeString()}`)))
            : el('p', {}, text.adminNoPrizes)))
      status.textContent = fill(text.adminUpdated, { time: new Date().toLocaleTimeString() })
    } catch {
      // Keep the last numbers on screen and say they couldn't be updated.
      status.textContent = text.adminError
    }
  }

  show(el('h1', { className: 'card' }, text.adminTitle), content, status,
    button(text.adminRefresh, load))
  load()
  setInterval(load, 10000)
}
