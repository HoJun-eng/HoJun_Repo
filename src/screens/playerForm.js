import config from '../data/config.json'
import { el, show } from '../ui.js'

export function playerFormScreen(onSubmit) {
  const { text, playerForm } = config

  const nickname = el('input', { type: 'text', maxLength: 20, autocomplete: 'off' })
  const groupSize = el('select', {},
    ...Array.from({ length: playerForm.maxGroupSize }, (_, i) =>
      el('option', { value: i + 1 }, String(i + 1))))
  const ages = playerForm.ageRanges.map((range) =>
    el('input', { type: 'checkbox', value: range }))
  const error = el('p', { className: 'error', role: 'alert' })

  const form = el('form', { className: 'card', noValidate: true },
    el('h2', {}, text.formTitle),
    el('label', { className: 'field' }, text.nicknameLabel, nickname),
    el('label', { className: 'field' }, text.groupSizeLabel, groupSize),
    el('fieldset', {},
      el('legend', {}, text.ageLabel),
      ...ages.map((box) => el('label', { className: 'check' }, box, box.value))),
    error,
    el('button', { type: 'submit' }, text.continueButton))

  form.onsubmit = (event) => {
    event.preventDefault()
    const player = {
      nickname: nickname.value.trim(),
      groupSize: Number(groupSize.value),
      ageRanges: ages.filter((box) => box.checked).map((box) => box.value),
    }
    if (!player.nickname || player.ageRanges.length === 0) {
      error.textContent = text.formError
      return
    }
    onSubmit(player)
  }
  show(form)
}
