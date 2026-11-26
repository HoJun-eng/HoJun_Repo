import config from '../data/config.json'
import questions from '../data/questions.json'
import { el, button, show, fill } from '../ui.js'

// 0 in config.json means "ask every question".
function roundSize() {
  return config.quiz.questionsPerRound || questions.length
}

function shuffle(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export const quiz = {
  id: 'quiz',
  name: config.text.quizName,
  get maxScore() {
    return Math.min(roundSize(), questions.length)
  },
  // Calls onFinish(score) after the last question.
  play(onFinish) {
    // Keep the file order unless only some of the questions are used.
    const pool = this.maxScore < questions.length ? shuffle(questions) : questions
    const round = pool.slice(0, this.maxScore)
    let index = 0
    let score = 0

    const ask = () => {
      const q = round[index]
      const options = q.options.map((option, i) =>
        button(option, () => {
          if (i === q.answerIndex) score++
          index++
          if (index < round.length) ask()
          else onFinish(score)
        }, 'option'),
      )
      show(
        el('p', { className: 'card small' },
          fill(config.text.questionCount, { current: index + 1, total: round.length })),
        el('h2', { className: 'card' }, q.question),
        ...options,
      )
    }
    ask()
  },
}
