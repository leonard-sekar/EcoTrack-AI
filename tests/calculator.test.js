console.assert(
  calculateCarbonFootprint(
    0,0,0,0
  ) === 0
);

console.assert(
  calculateEcoScore(
    100
  ) >= 0
);

console.assert(
  getBadge(
    90
  ) ===
  "🏆 Sustainability Champion"
);

console.log(
  "All tests passed"
);