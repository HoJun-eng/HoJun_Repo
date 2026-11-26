// Feed the Dino: choose Eat or Reject for each plate. 1 point per correct choice.
import config from '../data/config.json'
import { el, button, show, fill } from '../ui.js'

const settings = config.miniGame
const { text } = config

// Shows the image, or the placeholder emoji if the file isn't there.
function picture({ image, placeholder }, label) {
  const img = el('img', { src: image, alt: label })
  img.onerror = () => img.replaceWith(el('span', { role: 'img', ariaLabel: label }, placeholder))
  return img
}

// An equal share of each food (as near as possible), in random order.
function makePlates() {
  const plates = Array.from({ length: settings.plates },
    (_, i) => settings.foods[i % settings.foods.length])
  for (let i = plates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[plates[i], plates[j]] = [plates[j], plates[i]]
  }
  return plates
}

export const miniGame = {
  id: 'mini-game',
  name: text.miniGameName,
  maxScore: settings.plates,
  // Calls onFinish(score) after the last plate.
  play(onFinish) {
    // Load every picture early so faces change without a delay.
    for (const item of [...Object.values(settings.dino), ...settings.foods]) {
      new Image().src = item.image
    }
    show(
      el('div', { className: 'card' },
        el('h2', {}, this.name),
        el('p', {}, text.miniGameRules)),
      button(text.miniGameStartButton, run),
    )

    function run() {
      const plates = makePlates()
      let index = 0
      let score = 0
      let timer
      let answer = null // set while a plate is waiting for a choice

      const status = el('p', { className: 'card small' })
      const points = el('span')
      const dino = el('div', { className: 'dino' })
      const plate = el('div', { className: 'plate' })
      const eat = button(text.eatButton, () => answer?.('eat'))
      const reject = button(text.rejectButton, () => answer?.('reject'), 'reject')

      const setDino = (mood) => dino.replaceChildren(picture(settings.dino[mood], mood))

      const nextPlate = () => {
        const food = plates[index]
        setDino('neutral')
        status.replaceChildren(
          fill(text.plateCount, { current: index + 1, total: plates.length }),
          ' · ', points)
        points.textContent = fill(text.miniGameScore, { score })

        const moving = el('div', { className: 'food' }, picture(food, food.name))
        moving.style.animationDuration = `${settings.slideSeconds}s`
        plate.replaceChildren(moving)
        eat.disabled = reject.disabled = false

        // choice is 'eat', 'reject', or null when time runs out.
        answer = (choice) => {
          answer = null // ignore extra taps
          clearTimeout(timer)
          eat.disabled = reject.disabled = true
          plate.replaceChildren()

          const correct = choice === food.action
          if (correct) score++
          points.textContent = fill(text.miniGameScore, { score })
          setDino(!correct ? 'sad' : choice === 'eat' ? 'happy' : 'no')

          timer = setTimeout(() => {
            index++
            if (index < plates.length) nextPlate()
            else onFinish(score)
          }, settings.reactionSeconds * 1000)
        }
        timer = setTimeout(() => answer(null), settings.secondsPerPlate * 1000)
      }

      show(status,
        el('div', { className: 'stage' }, dino, plate),
        el('div', { className: 'actions' }, reject, eat))
      nextPlate()
    }
  },
}
