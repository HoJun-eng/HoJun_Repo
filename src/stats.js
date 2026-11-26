// Turns the saved records into the numbers shown on the Admin Screen.
export function summarise(records, games) {
  const ofType = (type) => records.filter((r) => r.type === type)
  const players = ofType('player')
  const results = ofType('result')

  return {
    groups: players.length,
    people: players.reduce((total, r) => total + (r.groupSize || 0), 0),
    finalViews: ofType('final_view').length,
    prizes: ofType('win').reverse(),
    games: games.map(({ id, name }) => {
      const played = results.filter((r) => r.game === id)
      const wins = played.filter((r) => r.won).length
      return {
        name,
        picked: ofType('pick').filter((r) => r.game === id).length,
        wins,
        losses: played.length - wins,
      }
    }),
  }
}
