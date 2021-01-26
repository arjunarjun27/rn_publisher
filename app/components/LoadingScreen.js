import React, { useEffect } from "react";
import { AsyncStorage } from "react-native";
import AppLoading from "expo-app-loading";

import SampleData from "../sample";

export default function LoadingScreen(props) {
  useEffect(() => checkLocalData(), []);

  function checkLocalData() {
    AsyncStorage.getItem("items", (err, data) => {
      if (data === null) {
        AsyncStorage.setItem("items", JSON.stringify(SampleData.items));
        props.navigation.navigate("App");
      } else {
        props.navigation.navigate("App");
      }
    });
  }

  return <AppLoading />;
}
