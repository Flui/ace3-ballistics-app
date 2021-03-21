export enum ATMOSPHERE_MODEL {
  ICAO = "ICAO",
  ASM = "ASM",
}

const STD_AIR_DENSITY_ICAO = 1.22498;
const STD_AIR_DENSITY_ASM = 1.20885;

const DRY_AIR_MOLAR_MASS = 0.028964;
const WATER_VAPOR_MOLAR_MASS = 0.018016;
const UNIVERSAL_GAS_CONSTANT = 8.314;
const SPECIFIC_GAS_CONSTANT_DRY_AIR = 287.058;
const ABSOLUTE_ZERO_IN_CELSIUS = -273.15;

const Kelvin = (temperature: number) => temperature - ABSOLUTE_ZERO_IN_CELSIUS;
const Celsius = (temperature: number) => temperature + ABSOLUTE_ZERO_IN_CELSIUS;

/**
 *
 * @param temperature - degrees celsius
 * @param pressureInHPa - hPa
 * @param relativeHumidity - value between 0.0 and 1.0
 * @returns density of air - kg * m^(-3) <NUMBER>
 */
export const calculateAirDensity = (
  temperature: number,
  pressureInHPa: number,
  relativeHumidity: number
): number => {
  const pressure = pressureInHPa * 100; // hPa to Pa
  if (relativeHumidity > 0) {
    // Saturation vapor pressure calculated according to: http://wahiduddin.net/calc/density_algorithms.htm
    // 610.78 gives pressure in Pa - https://en.wikipedia.org/wiki/Density_of_air
    const pSat =
      610.78 * Math.pow(10, (7.5 * temperature) / (temperature + 237.3));
    const vaporPressure = relativeHumidity * pSat;
    const partialPressure = pressure - vaporPressure;

    return (
      (partialPressure * DRY_AIR_MOLAR_MASS +
        vaporPressure * WATER_VAPOR_MOLAR_MASS) /
      (UNIVERSAL_GAS_CONSTANT * Kelvin(temperature))
    );
  }
  return pressure / (SPECIFIC_GAS_CONSTANT_DRY_AIR * Kelvin(temperature));
};

export const calculateAtmosphericCorrection = (
  ballisticCoefficient: number,
  temperature: number,
  barometricPressure: number,
  relativeHumidity: number,
  atmosphereModel: ATMOSPHERE_MODEL
): number => {
  const airDensity = calculateAirDensity(
    temperature,
    barometricPressure,
    relativeHumidity
  );
  const stdAirDensity =
    atmosphereModel === ATMOSPHERE_MODEL.ICAO
      ? STD_AIR_DENSITY_ICAO
      : STD_AIR_DENSITY_ASM;
  return (stdAirDensity / airDensity) * ballisticCoefficient;
};

export const calculateRetard = (
  dragModel: number,
  bc: number,
  trueSpeed: number
): number => {
  let A: null | number = null;
  let M: null | number = null;
  const velocity = trueSpeed * 3.2808399;

  switch (dragModel) {
    case 1: {
      if (velocity > 4230) {
        A = 0.0001477404177730177;
        M = 1.9565;
        break;
      }
      if (velocity > 3680) {
        A = 0.0001920339268755614;
        M = 1.925;
        break;
      }
      if (velocity > 3450) {
        A = 0.0002894751026819746;
        M = 1.875;
        break;
      }
      if (velocity > 3295) {
        A = 0.0004349905111115636;
        M = 1.825;
        break;
      }
      if (velocity > 3130) {
        A = 0.0006520421871892662;
        M = 1.775;
        break;
      }
      if (velocity > 2960) {
        A = 0.0009748073694078696;
        M = 1.725;
        break;
      }
      if (velocity > 2830) {
        A = 0.001453721560187286;
        M = 1.675;
        break;
      }
      if (velocity > 2680) {
        A = 0.002162887202930376;
        M = 1.625;
        break;
      }
      if (velocity > 2460) {
        A = 0.003209559783129881;
        M = 1.575;
        break;
      }
      if (velocity > 2225) {
        A = 0.003904368218691249;
        M = 1.55;
        break;
      }
      if (velocity > 2015) {
        A = 0.003222942271262336;
        M = 1.575;
        break;
      }
      if (velocity > 1890) {
        A = 0.002203329542297809;
        M = 1.625;
        break;
      }
      if (velocity > 1810) {
        A = 0.001511001028891904;
        M = 1.675;
        break;
      }
      if (velocity > 1730) {
        A = 0.0008609957592468259;
        M = 1.75;
        break;
      }
      if (velocity > 1595) {
        A = 0.0004086146797305117;
        M = 1.85;
        break;
      }
      if (velocity > 1520) {
        A = 0.0001954473210037398;
        M = 1.95;
        break;
      }
      if (velocity > 1420) {
        A = 0.00005431896266462351;
        M = 2.125;
        break;
      }
      if (velocity > 1360) {
        A = 0.000008847742581674416;
        M = 2.375;
        break;
      }
      if (velocity > 1315) {
        A = 0.000001456922328720298;
        M = 2.625;
        break;
      }
      if (velocity > 1280) {
        A = 0.0000002419485191895565;
        M = 2.875;
        break;
      }
      if (velocity > 1220) {
        A = 0.00000001657956321067612;
        M = 3.25;
        break;
      }
      if (velocity > 1185) {
        A = 0.0000000004745469537157371;
        M = 3.75;
        break;
      }
      if (velocity > 1150) {
        A = 0.00000000001379746590025088;
        M = 4.25;
        break;
      }
      if (velocity > 1100) {
        A = 0.0000000000004070157961147882;
        M = 4.75;
        break;
      }
      if (velocity > 1060) {
        A = 0.00000000000002938236954847331;
        M = 5.125;
        break;
      }
      if (velocity > 1025) {
        A = 0.00000000000001228597370774746;
        M = 5.25;
        break;
      }
      if (velocity > 980) {
        A = 0.00000000000002916938264100495;
        M = 5.125;
        break;
      }
      if (velocity > 945) {
        A = 0.0000000000003855099424807451;
        M = 4.75;
        break;
      }
      if (velocity > 905) {
        A = 0.00000000001185097045689854;
        M = 4.25;
        break;
      }
      if (velocity > 860) {
        A = 0.0000000003566129470974951;
        M = 3.75;
        break;
      }
      if (velocity > 810) {
        A = 0.00000001045513263966272;
        M = 3.25;
        break;
      }
      if (velocity > 780) {
        A = 0.0000001291159200846216;
        M = 2.875;
        break;
      }
      if (velocity > 750) {
        A = 0.0000006824429329105383;
        M = 2.625;
        break;
      }
      if (velocity > 700) {
        A = 0.000003569169672385163;
        M = 2.375;
        break;
      }
      if (velocity > 640) {
        A = 0.00001839015095899579;
        M = 2.125;
        break;
      }
      if (velocity > 600) {
        A = 0.0000571117468873424;
        M = 1.95;
        break;
      }
      if (velocity > 550) {
        A = 0.00009226557091973427;
        M = 1.875;
        break;
      }
      if (velocity > 250) {
        A = 0.00009337991957131389;
        M = 1.875;
        break;
      }
      if (velocity > 100) {
        A = 0.00007225247327590413;
        M = 1.925;
        break;
      }
      if (velocity > 65) {
        A = 0.00005792684957074546;
        M = 1.975;
        break;
      }
      if (velocity > 0) {
        A = 0.00005206214107320588;
        M = 2.0;
        break;
      }
      break;
    }
    case 2: {
      if (velocity > 1674) {
        A = 0.0079470052136733;
        M = 1.36999902851493;
        break;
      }
      if (velocity > 1172) {
        A = 0.00100419763721974;
        M = 1.65392237010294;
        break;
      }
      if (velocity > 1060) {
        A = 0.0000000000000000000000715571228255369;
        M = 7.91913562392361;
        break;
      }
      if (velocity > 949) {
        A = 0.000000000139589807205091;
        M = 3.81439537623717;
        break;
      }
      if (velocity > 670) {
        A = 0.000234364342818625;
        M = 1.71869536324748;
        break;
      }
      if (velocity > 335) {
        A = 0.000177962438921838;
        M = 1.76877550388679;
        break;
      }
      if (velocity > 0) {
        A = 0.0000518033561289704;
        M = 1.98160270524632;
        break;
      }
      break;
    }
    case 5: {
      if (velocity > 1730) {
        A = 0.00724854775171929;
        M = 1.41538574492812;
        break;
      }
      if (velocity > 1228) {
        A = 0.0000350563361516117;
        M = 2.13077307854948;
        break;
      }
      if (velocity > 1116) {
        A = 0.000000000000184029481181151;
        M = 4.81927320350395;
        break;
      }
      if (velocity > 1004) {
        A = 0.000000000000000000000134713064017409;
        M = 7.8100555281422;
        break;
      }
      if (velocity > 837) {
        A = 0.000000103965974081168;
        M = 2.84204791809926;
        break;
      }
      if (velocity > 335) {
        A = 0.0001093015938698234;
        M = 1.81096361579504;
        break;
      }
      if (velocity > 0) {
        A = 0.0000351963178524273;
        M = 2.00477856801111;
        break;
      }
      break;
    }
    case 6: {
      if (velocity > 3236) {
        A = 0.0455384883480781;
        M = 1.15997674041274;
        break;
      }
      if (velocity > 2065) {
        A = 0.07167261849653769;
        M = 1.10704436538885;
        break;
      }
      if (velocity > 1311) {
        A = 0.00166676386084348;
        M = 1.60085100195952;
        break;
      }
      if (velocity > 1144) {
        A = 0.000000101482730119215;
        M = 2.9569674731838;
        break;
      }
      if (velocity > 1004) {
        A = 0.00000000000000000431542773103552;
        M = 6.34106317069757;
        break;
      }
      if (velocity > 670) {
        A = 0.0000204835650496866;
        M = 2.11688446325998;
        break;
      }
      if (velocity > 0) {
        A = 0.0000750912466084823;
        M = 1.92031057847052;
        break;
      }
      break;
    }
    case 7: {
      if (velocity > 4200) {
        A = 0.00000000129081656775919;
        M = 3.24121295355962;
        break;
      }
      if (velocity > 3000) {
        A = 0.0171422231434847;
        M = 1.27907168025204;
        break;
      }
      if (velocity > 1470) {
        A = 0.00233355948302505;
        M = 1.52693913274526;
        break;
      }
      if (velocity > 1260) {
        A = 0.000797592111627665;
        M = 1.67688974440324;
        break;
      }
      if (velocity > 1110) {
        A = 0.00000000000571086414289273;
        M = 4.3212826264889;
        break;
      }
      if (velocity > 960) {
        A = 0.0000000000000000302865108244904;
        M = 5.99074203776707;
        break;
      }
      if (velocity > 670) {
        A = 0.00000752285155782535;
        M = 2.1738019851075;
        break;
      }
      if (velocity > 540) {
        A = 0.0000131766281225189;
        M = 2.08774690257991;
        break;
      }
      if (velocity > 0) {
        A = 0.0000134504843776525;
        M = 2.08702306738884;
        break;
      }
      break;
    }
    case 8: {
      if (velocity > 3571) {
        A = 0.0112263766252305;
        M = 1.33207346655961;
        break;
      }
      if (velocity > 1841) {
        A = 0.0167252613732636;
        M = 1.28662041261785;
        break;
      }
      if (velocity > 1120) {
        A = 0.00220172456619625;
        M = 1.55636358091189;
        break;
      }
      if (velocity > 1088) {
        A = 0.00000000000000020538037167098;
        M = 5.80410776994789;
        break;
      }
      if (velocity > 976) {
        A = 0.00000000000592182174254121;
        M = 4.29275576134191;
        break;
      }
      if (velocity > 0) {
        A = 0.000043917343795117;
        M = 1.99978116283334;
        break;
      }
      break;
    }
  }

  if (A !== null && M !== null && velocity > 0 && velocity < 10000) {
    return (A * Math.pow(velocity, M)) / bc / 3.2808399;
  }

  return 0;
};

/**
 *
 * @param bulletDiameter - mm
 * @param bulletLength - mm
 * @param bulletMass - grams
 * @param barrelTwist - mm
 * @param muzzleVelocity - m/s
 * @param temperature - degrees celcius
 * @param barometricPressure - hPA
 * @returns - stability factor
 */
export const calculateStabilityFactor = (
  bulletDiameter: number,
  bulletLength: number,
  bulletMass: number,
  barrelTwist: number,
  muzzleVelocity: number,
  temperature: number,
  barometricPressure: number
) => {
  const twist = barrelTwist / bulletDiameter;
  const length = bulletLength / bulletDiameter;
  const stabilityFactor =
    (7587000 * bulletMass) /
    (Math.pow(twist, 2) *
      Math.pow(bulletDiameter, 3) *
      length *
      (1 + Math.pow(length, 2)));

  return (
    (((stabilityFactor *
      Math.pow(
        muzzleVelocity / (muzzleVelocity > 341.376 ? 853.44 : 341.376),
        1 / 3
      ) *
      Kelvin(temperature)) /
      Kelvin(15)) *
      1013.25) /
    barometricPressure
  );
};
