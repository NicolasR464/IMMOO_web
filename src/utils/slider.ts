
export const sliderToPrice = (val: number): number => {
  if (val <= 50) {
    return Math.round((val / 50) * 1_000_000);
  }
  return Math.round(1_000_000 + ((val - 50) / 50) * 4_000_000);
};

export const priceToSlider = (price: number): number => {
  if (price <= 1_000_000) {
    return (price / 1_000_000) * 50;
  }
  return 50 + ((price - 1_000_000) / 4_000_000) * 50;
};