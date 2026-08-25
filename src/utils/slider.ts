
// Maps slider position (0 to 100) to actual euro price
export function sliderToPrice(val: number): number {
  if (val <= 70) {
    // 0 to 70% of track maps linearly from €0 to €1,000,000
    // Granularity: ~€14,285 per slider step
    const price = (val / 70) * 1_000_000;
    return Math.round(price / 10_000) * 10_000; // Round to clean €10k steps
  } else {
    // 70 to 100% of track maps linearly from €1,000,000 to €5,000,000
    // Granularity: ~€133,333 per slider step
    const norm = (val - 70) / 30;
    const price = 1_000_000 + norm * 4_000_000;
    return Math.round(price / 50_000) * 50_000; // Round to clean €50k steps
  }
}

// Maps actual euro price back to slider position (0 to 100)
export function priceToSlider(price: number): number {
  if (price <= 1_000_000) {
    return (price / 1_000_000) * 70;
  } else {
    const norm = Math.min(price - 1_000_000, 4_000_000) / 4_000_000;
    return 70 + norm * 30;
  }
}