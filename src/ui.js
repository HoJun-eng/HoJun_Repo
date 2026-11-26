// Small helpers shared by all screens.

// Create an element. Text is added safely (never treated as HTML).
export function el(tag, props = {}, ...children) {
  const node = Object.assign(document.createElement(tag), props)
  node.append(...children)
  return node
}

export function button(label, onClick, className = '') {
  return el('button', { type: 'button', className, onclick: onClick }, label)
}

// Replace the current screen.
export function show(...children) {
  document.querySelector('#app').replaceChildren(el('main', { className: 'screen' }, ...children))
  window.scrollTo(0, 0)
}

// Fill in placeholders such as {score} in text from config.json.
export function fill(template, values) {
  return template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match)
}
