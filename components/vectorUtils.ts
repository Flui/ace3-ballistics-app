export const vectorAdd = (
  [x, y, z]: [number, number, number],
  [a, b, c]: [number, number, number]
): [number, number, number] => [x + a, y + b, z + c];

export const vectorMagnitude = ([x, y, z]: [number, number, number]): number =>
  Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));

export const vectorDiff = (
  [x, y, z]: [number, number, number],
  [a, b, c]: [number, number, number]
): [number, number, number] => [x - a, y - b, z - c];

export const vectorNormalized = (
  vector: [number, number, number]
): [number, number, number] => vectorDivide(vector, vectorMagnitude(vector));

export const vectorDivide = (
  [x, y, z]: [number, number, number],
  scalar: number
): [number, number, number] => [x / scalar, y / scalar, z / scalar];

export const vectorMultiply = (
  [x, y, z]: [number, number, number],
  scalar: number
): [number, number, number] => [x * scalar, y * scalar, z * scalar];

export const radiansToDegrees = (radians: number): number =>
  radians * (180 / Math.PI);
