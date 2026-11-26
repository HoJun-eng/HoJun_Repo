import config from './data/config.json'

// The lowest whole score that reaches the pass mark.
export function passScore(max) {
  return Math.ceil((max * config.passPercent) / 100)
}
