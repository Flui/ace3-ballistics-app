import {
  ATMOSPHERE_MODEL,
  calculateAtmosphericCorrection,
  calculateRetard,
} from "./advancedBallistics";
import {
  radiansToDegrees,
  vectorAdd,
  vectorDiff,
  vectorMagnitude,
  vectorMultiply,
  vectorNormalized,
} from "./vectorUtils";

const GRAVITY = 9.81;

export const calculateBalistics = (
  scopeBaseAngle: number,
  bulletMass: number,
  boreHeight: number,
  airFriction: number,
  muzzleVelocity: number,
  temperature: number,
  barometricPressure: number,
  relativeHumidity: number,
  simulationSteps: number,
  windSpeed: [number, number],
  windDirection: number,
  inclinationAngle: number,
  targetSpeed: number,
  targetRange: number,
  ballisticCoefficient: number,
  dragModel: number,
  atmosphereModel: ATMOSPHERE_MODEL,
  storeRangeCardData: boolean,
  stabilityFactor: number,
  twistDirection: number,
  latitude: number,
  directionOfFire: number,
  advancedBalistics: boolean
): {
  elevation: number;
  windage: [number,number];
  lead: number;
  timeOfFlight: number; // in seconds
  remainingVelocity: number; // in m/s
  remainingKineticEnergy: number; // in ft*lb
  verticalCoriolisDrift: number;
  horizonbtalCoriolisDrift: number;
  spinDrift: number;
} => {
  const [windSpeed1, windSpeed2] = windSpeed;
  let tx = 0;
  let tz = 0;
  let lastBulletPos: [number, number, number] = [0, 0, 0];
  let bulletPos: [number, number, number] = [0, 0, 0];
  let bulletVelocity: [number, number, number] = [0, 0, 0];
  let bulletAccel: [number, number, number] = [0, 0, 0];
  let bulletSpeed = 0;
  const gravity: [number, number, number] = [
    0,
    Math.sin(scopeBaseAngle + inclinationAngle) * -GRAVITY,
    Math.cos(scopeBaseAngle + inclinationAngle) * -GRAVITY,
  ];
  const deltaT = 1 / simulationSteps;

  let elevation = 0;
  let windage1 = 0;
  let windage2 = 0;
  let lead = 0;
  let TOF = 0;
  let trueVelocity: [number, number, number] = [0, 0, 0];
  let trueSpeed = 0;
  let kineticEnergy = 0;
  let verticalCoriolis = 0;
  let verticalDeflection = 0;
  let horizontalCoriolis = 0;
  let horizontalDeflection = 0;
  let spinDrift = 0;
  let spinDeflection = 0;

  const n = 0;
  const range = 0;
  const trueRange = 0;
  const rangeFactor = 1;

  if (storeRangeCardData) {
    //  TODO store rangecard
  }

  const wind1: [number, number, number] = [
    Math.cos(270 - windDirection * 30) * windSpeed1,
    Math.sin(270 - windDirection * 30) * windSpeed1,
    0,
  ];
  const wind2: [number, number, number] = [
    Math.cos(270 - windDirection * 30) * windSpeed2,
    Math.sin(270 - windDirection * 30) * windSpeed2,
    0,
  ];
  let windDrift = 0;

  const bc = advancedBalistics
    ? calculateAtmosphericCorrection(
        ballisticCoefficient,
        temperature,
        barometricPressure,
        relativeHumidity,
        atmosphereModel
      )
    : ballisticCoefficient;

  const eoetvoesMultiplier = advancedBalistics
    ? 2 *
      ((0.0000729 * muzzleVelocity) / -GRAVITY) *
      Math.cos(latitude) *
      Math.sin(directionOfFire)
    : 0;

  bulletPos = [0, 0, -(boreHeight / 100)];
  bulletVelocity = [
    1,
    Math.cos(scopeBaseAngle) * muzzleVelocity,
    Math.sin(scopeBaseAngle) * muzzleVelocity,
  ];

  while (TOF < 15 && bulletPos[1] < targetRange) {
    bulletSpeed = vectorMagnitude(trueVelocity);
    trueVelocity = vectorDiff(bulletVelocity, wind1);
    trueSpeed = vectorMagnitude(trueVelocity);

    if (advancedBalistics) {
      const drag = calculateRetard(dragModel, bc, trueSpeed);
      bulletAccel = vectorMultiply(vectorNormalized(trueVelocity), -1 * drag);
    } else {
      bulletAccel = vectorMultiply(trueVelocity, trueSpeed * airFriction);
    }

    bulletAccel = vectorAdd(bulletAccel, gravity);

    lastBulletPos = bulletPos;
    bulletPos = vectorAdd(
      bulletPos,
      vectorMultiply(bulletVelocity, deltaT * 0.5)
    );
    bulletVelocity = vectorAdd(
      bulletVelocity,
      vectorMultiply(bulletAccel, deltaT)
    );
    bulletPos = vectorAdd(
      bulletPos,
      vectorMultiply(bulletVelocity, deltaT * 0.5)
    );

    TOF = TOF + deltaT;

    if (storeRangeCardData) {
      // TODO: implement
    }
  }

  if (targetRange !== 0) {
    tx =
      lastBulletPos[0] +
      ((targetRange - lastBulletPos[1]) * (bulletPos[0] - lastBulletPos[0])) /
        (bulletPos[1] - lastBulletPos[1]);
    tz =
      lastBulletPos[2] +
      ((targetRange - lastBulletPos[1]) * (bulletPos[2] - lastBulletPos[2])) /
        (bulletPos[1] - lastBulletPos[1]);
    elevation = -Math.atan(tz / targetRange);
    windage1 = -Math.atan(tx / targetRange);
    windDrift = wind2[0] * (TOF - targetRange / muzzleVelocity);
    windage2 = -Math.atan(windDrift / targetRange);
    lead = (targetSpeed * TOF) / (Math.tan(radiansToDegrees(1)) * targetRange);
  }

  kineticEnergy = 0.5 * ((bulletMass / 1000) * Math.pow(bulletSpeed, 2));
  kineticEnergy = kineticEnergy * 0.737562149;

  if (advancedBalistics && bulletPos[1] > 0) {
    horizontalDeflection = 0.0000729 * bulletPos[1] * TOF * Math.sin(latitude);
    horizontalCoriolis = -Math.atan(horizontalDeflection / bulletPos[1]);
    windage1 = windage1 + horizontalCoriolis;
    windage2 = windage2 + horizontalCoriolis;
    // Eoetvoes
    verticalDeflection = bulletPos[2] * eoetvoesMultiplier;
    verticalCoriolis = -Math.atan(verticalDeflection / bulletPos[1]);
    elevation = elevation + verticalCoriolis;
    // Spin drift
    spinDeflection =
      twistDirection *
      0.0254 *
      1.25 *
      (stabilityFactor + 1.2) *
      Math.pow(TOF, 1.83);
    spinDrift = -Math.atan(spinDeflection / bulletPos[1]);
    windage1 = windage1 + spinDrift;
    windage2 = windage2 + spinDrift;
  }

  return {
    elevation: elevation * 60,
    windage: [windage1 * 60, windage2 * 60],
    lead,
    timeOfFlight: TOF,
    remainingVelocity: bulletSpeed,
    remainingKineticEnergy: kineticEnergy,
    verticalCoriolisDrift: verticalCoriolis * 60,
    horizonbtalCoriolisDrift: horizontalCoriolis * 60,
    spinDrift: spinDrift * 60,
  };
};
