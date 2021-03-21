import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import routes from "./routes";
import { ATMOSPHERE_MODEL } from "./components/advancedBallistics";
import { gunList } from "./components/gunlist";
import useCachedResources from "./hooks/useCachedResources";
import DefaultScreen from "./screens/DefaultScreen";
import GunList from "./screens/GunList";

const Stack = createStackNavigator();

export default function App() {
  const isLoadingComplete = useCachedResources();
  const [atmsphr, setAtmsphr] = useState<{
    barometricPressure: number;
    relativeHumidity: number;
    temperature: number;
  }>({
    barometricPressure: 1013, // BP
    relativeHumidity: 50, // RH
    temperature: 15, // Tmp
  });
  const [gun, setGun] = useState<
    [
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
    ]
  >(gunList[0]);
  const [target, setTarget] = useState<{
    directionOfFire: number;
    inclinationAngle: number;
    latitude: number;
    targetRange: number;
    targetSpeed: number;
    windDirection: number;
    windSpeed: number;
  }>({
    directionOfFire: 0,
    latitude: 38,
    inclinationAngle: 0, // IA
    targetRange: 1000, // TR
    targetSpeed: 0, // TS
    windDirection: 0, // WD
    windSpeed: 0, // WS
  });

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name={routes.root}>
              {({ navigation }) => (
                <DefaultScreen
                  atmsphr={atmsphr}
                  gun={gun}
                  navigation={navigation}
                  target={target}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name={routes.gunlist}>
              {(props) => <GunList />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}
