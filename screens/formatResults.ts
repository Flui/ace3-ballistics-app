export const formatHorizontalDrift = (
  drift: number,
  diggits: number
): string => {
  const roundedValue = Math.round(drift * 100) / 100;
  if (roundedValue === 0) {
    return "0";
  }

  const absoluteValue = Math.abs(roundedValue).toFixed(diggits);
  return roundedValue < 0 ? `${absoluteValue}L` : `${absoluteValue}R`;
};

export const formatVerticalDrift = (drift: number, diggits: number): string => {
  const roundedValue = Math.round(drift * 100) / 100;
  if (roundedValue === 0) {
    return "0";
  }

  const absoluteValue = Math.abs(roundedValue).toFixed(diggits);
  return roundedValue < 0 ? absoluteValue : `${absoluteValue}D`;
};
