import React, { useState } from "react";
import { Link } from '@react-navigation/native';

import { Text, View } from "../components/Themed";
import { gunList } from "../components/gunlist";

const GunList = ({  }) => {
  const [selectedGun, setSelectedGun] = useState<number>();

  return (
    <View>
      <Text>AtragGun.gun</Text>
    </View>
  );
};

export default GunList;
