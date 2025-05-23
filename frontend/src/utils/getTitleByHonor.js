function getTitleByHonor(honor) {
  if (honor >= 100) return "Legendary Hunter";
  if (honor >= 75) return "Elite Hunter";
  if (honor >= 50) return "Veteran Hunter";
  if (honor >= 25) return "Skilled Hunter";
  if (honor >= 10) return "Novice Hunter";
  return "Rookie";
}

module.exports = { getTitleByHonor };
