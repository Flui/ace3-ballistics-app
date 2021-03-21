import * as React from "react";
import { Button, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

import { InputKey, InputRow, InputValue } from "../components/StyledInput";
import { Text, View } from "../components/Themed";
import { Cell, Row } from "../components/StyledTable";
import {
  ATMOSPHERE_MODEL,
  calculateStabilityFactor,
} from "../components/advancedBallistics";
import { calculateBalistics } from "../components/calculateBallistics";
import { formatHorizontalDrift, formatVerticalDrift } from "./formatResults";
import routes from "../routes";

const ADVANCED_BALLISTICS_ACTIVE = true;

type TProps = {
  atmsphr: {
    barometricPressure: number;
    relativeHumidity: number;
    temperature: number;
  };
  gun: [
    string, // Profile Name
    number, // Muzzle Velocity
    number, // Zero Range
    number, // Scope Base Angle
    number, // AirFriction
    number, // Bore Height
    number, // Scope Unit
    number, // Scope Click Unit
    number, // Scope Click Number
    number, // Maximum Elevation
    number, // Dialed Elevation
    number, // Dialed Windage
    number, // Mass
    number, // Bullet Diameter
    number, // Rifle Twist
    number, // BC
    number, // Drag Model
    ATMOSPHERE_MODEL, // Atmosphere Model
    [number, number][], // Muzzle Velocity vs. Temperature Interpolation
    [number, number][], // C1 Ballistic Coefficient vs. Distance Interpolation
    boolean // Persistent
  ];
  navigation: StackNavigationProp<{ }>;
  target: {
    directionOfFire: number;
    inclinationAngle: number;
    latitude: number;
    targetRange: number;
    targetSpeed: number;
    windDirection: number;
    windSpeed: number;
  };
};

const TabOneScreen: React.FC<TProps> = ({ atmsphr, gun, navigation, target }: TProps) => {
  const { barometricPressure, relativeHumidity, temperature } = atmsphr;
  const [
    profileName,
    muzzleVelocity,
    zeroRange,
    scopeBaseAngle,
    airFriction,
    boreHeight,
    scopeUnit,
    scopeClickUnit,
    scopeClickNumber,
    maximumElevation,
    dialedElevation,
    dialedWindage,
    bulletMass,
    bulletDiameter,
    barrelTwist,
    ballisticCoefficient,
    dragModel,
    atmosphereModel,
    muzzleVelocityVsTemperatureInterpolation,
    c1BallisticCoefficientVsDistanceInterpolation,
    persistent,
  ] = gun;
  const {
    directionOfFire,
    inclinationAngle,
    latitude,
    targetRange,
    targetSpeed,
    windDirection,
    windSpeed,
  } = target;

  let twistDirection = 0;
  if (barrelTwist !== 0) {
    twistDirection = barrelTwist > 0 ? 1 : -1;
  }
  const absoluteBarrelTwist = Math.abs(barrelTwist);

  const bulletLength = (50 * bulletMass) / ((bulletDiameter / 2) ^ 2);
  let stabilityFactor = 1.5;
  if (
    ADVANCED_BALLISTICS_ACTIVE &&
    bulletDiameter > 0 &&
    bulletLength > 0 &&
    bulletMass > 0 &&
    absoluteBarrelTwist > 0
  ) {
    stabilityFactor = calculateStabilityFactor(
      bulletDiameter,
      bulletLength,
      bulletMass,
      absoluteBarrelTwist * 10,
      muzzleVelocity,
      temperature,
      barometricPressure
    );
  }

  const result = React.useMemo(
    () =>
      calculateBalistics(
        scopeBaseAngle,
        bulletMass,
        boreHeight,
        airFriction,
        muzzleVelocity,
        temperature,
        barometricPressure,
        relativeHumidity,
        Math.round(muzzleVelocity),
        [windSpeed, windSpeed], // TODO: windSpeed1 & 2
        windDirection,
        inclinationAngle,
        targetSpeed,
        targetRange,
        ballisticCoefficient,
        dragModel,
        atmosphereModel,
        false,
        stabilityFactor,
        twistDirection,
        latitude,
        directionOfFire,
        ADVANCED_BALLISTICS_ACTIVE
      ),
    []
  );
  const {
    elevation,
    windage,
    lead,
    timeOfFlight,
    remainingVelocity,
    remainingKineticEnergy,
    verticalCoriolisDrift,
    horizonbtalCoriolisDrift,
    spinDrift,
  } = result;

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.ammu}>{profileName}</Text>
        <Text>D</Text>
      </View>
      <Row>
        <View
          style={styles.section}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        >
          <Text style={styles.title}>Gun</Text>
          <InputRow>
            <InputKey>BH</InputKey>
            <InputValue>{boreHeight}</InputValue>
          </InputRow>
          <InputRow>
            <InputKey>BW</InputKey>
            <InputValue>{bulletMass}</InputValue>
          </InputRow>
          <InputRow>
            <InputKey>C1</InputKey>
            <InputValue>{ballisticCoefficient}</InputValue>
          </InputRow>
          <InputRow>
            <InputKey>MV</InputKey>
            <InputValue>{muzzleVelocity}</InputValue>
          </InputRow>
          <InputRow>
            <InputKey>ZR</InputKey>
            <InputValue>{zeroRange}</InputValue>
          </InputRow>
        </View>
        <View
          style={styles.section}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        >
          <Text style={styles.title}>Atmsphr</Text>
          <InputRow />
          <InputRow>
            <InputKey>Tmp</InputKey>
            <InputValue>{temperature}</InputValue>
          </InputRow>
          <InputRow>
            <InputKey>BP</InputKey>
            <InputValue>{barometricPressure}</InputValue>
          </InputRow>
          <InputRow>
            <InputKey>RH</InputKey>
            <InputValue>{relativeHumidity}</InputValue>
          </InputRow>
          <InputRow>ABCD</InputRow>
        </View>
        <View
          style={styles.section}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        >
          <Text style={styles.title}>Target</Text>
          <InputRow>
            <InputKey>WS</InputKey>
            <InputValue>{windSpeed}</InputValue>
          </InputRow>
          <InputRow>
            <InputKey>WD</InputKey>
            <InputValue>{windDirection}</InputValue>
          </InputRow>
          <InputRow>
            <InputKey>IA</InputKey>
            <InputValue>{inclinationAngle}</InputValue>
          </InputRow>
          <InputRow>
            <InputKey>TS</InputKey>
            <InputValue>{targetSpeed}</InputValue>
          </InputRow>
          <InputRow>
            <InputKey>TR</InputKey>
            <InputValue>{targetRange}</InputValue>
          </InputRow>
        </View>
      </Row>
      <View style={styles.section}>
        <Row>
          <Cell></Cell>
          <Cell>Hold</Cell>
          <Cell>Cor</Cell>
          <Cell>Spin</Cell>
        </Row>
        <Row>
          <Cell>Elev</Cell>
          <Cell style={styles.resultValue}>
            {formatVerticalDrift(elevation, 1)}
          </Cell>
          <Cell style={styles.resultValue}>
            {formatVerticalDrift(verticalCoriolisDrift, 1)}
          </Cell>
          <Cell />
        </Row>
        <Row>
          <Cell>Wind</Cell>
          <Cell style={styles.resultValue}>
            {formatHorizontalDrift(windage[0], 2)}
          </Cell>
          <Cell style={styles.resultValue}>
            {formatHorizontalDrift(horizonbtalCoriolisDrift, 2)}
          </Cell>
          <Cell style={styles.resultValue}>
            {formatHorizontalDrift(spinDrift, 2)}
          </Cell>
        </Row>
        <Row>
          <Cell>Lead</Cell>
          <Cell style={styles.resultValue}>
            {formatHorizontalDrift(lead, 1)}
          </Cell>
          <Cell />
          <Cell />
        </Row>
      </View>
      <Button onPress={() => navigation.navigate(routes.gunlist)} >
        <Text>gunlist</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  ammu: {
    fontWeight: "bold",
    margin: "8px",
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resultValue: {
    borderColor: "black",
    borderWidth: 2,
    borderStyle: "solid",
    textAlign: "right",
  },
  section: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
    margin: "2px",
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

export default TabOneScreen;
