import React, { useEffect } from "react";
import { AsyncStorage } from "react-native";
import { AppLoading } from "expo";

import SampleData from "../sample";
import Message from "./Message";

export default function LoadingScreen(props) {
  useEffect(() => checkLocalData(), []);

  function checkLocalData() {
    AsyncStorage.getItem("quotes", (err, data) => {
      //if it doesn't exist, extract from json fil
      if (data === null) {
        AsyncStorage.setItem("quotes", JSON.stringify(SampleData.quotes)); //save the initial data in Async
        props.navigation.navigate("App"); //Navigate to the home page
      } else {
        props.navigation.navigate("App"); //Navigate to the home page
      }
    });
  }

  return <AppLoading />;
}
