export function assignCircularSwaps(teamIds) {
  if (!Array.isArray(teamIds) || teamIds.length < 2) return [];

  const shuffled = [...teamIds];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.map((receivingTeamId, index) => ({
    receiving_team_id: receivingTeamId,
    assigned_team_id: shuffled[(index + 1) % shuffled.length]
  }));
}
