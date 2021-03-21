import * as React from "react";

import { View, Text, TextProps } from "./Themed";

export function Row(props: TextProps) {
  return (
    <View
      {...props}
      style={[
        props.style,
        {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
      ]}
    />
  );
}

export function Cell(props: TextProps) {
  return (
    <Text
      {...props}
      style={[
        props.style,
        {
          fontWeight: "800",
          paddingTop: 2,
          paddingRight: 8,
          paddingBottom: 2,
          paddingLeft: 8,
          width: '20%',
          height: 28,
          margin: 2,
        },
      ]}
    />
  );
}
