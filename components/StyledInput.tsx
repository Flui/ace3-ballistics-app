import * as React from "react";

import { View, Text, TextProps } from "./Themed";

export function InputRow(props: TextProps) {
  return (
    <View
      {...props}
      style={[
        props.style,
        {
          backgroundColor: "white",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "4px",
          height: "24px",
          minHeight: "24px",
        },
      ]}
    />
  );
}

export function InputKey(props: TextProps) {
  return (
    <Text
      {...props}
      style={[
        props.style,
        {
          fontWeight: "800",
        },
      ]}
    />
  );
}

export function InputValue(props: TextProps) {
  return (
    <Text
      {...props}
      style={[
        props.style,
        {
          fontWeight: "800",
        },
      ]}
    />
  );
}
