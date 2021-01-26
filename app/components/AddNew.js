import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  AsyncStorage,
} from "react-native";

import { useDispatch } from "react-redux";
import { Header } from "react-navigation-stack";

import { addItem, updateItem } from "../actions";

export default function AddNew(props) {
  const dispatch = useDispatch();
  const { navigation } = props;

  let quote = navigation.getParam("quote", null);

  const [isSaving, setIsSaving] = useState(false);
  const [publisher, setPubisher] = useState(quote ? quote.author : "");
  const [location, setLocation] = useState(quote ? quote.text : "");

  const onSave = () => {
    let edit = quote !== null;
    let quote_ = {};

    if (edit) {
      quote_ = quote;
      quote_["author"] = publisher;
      quote_["text"] = location;
    } else {
      let id = generateID();
      quote_ = { id: id, author: publisher, text: location };
    }

    AsyncStorage.getItem("items", (err, items) => {
      if (err) alert(err.message);
      else if (items !== null) {
        items = JSON.parse(items);

        if (!edit) {
          items.unshift(quote_);
        } else {
          const index = items.findIndex((obj) => obj.id === quote_.id);
          if (index !== -1) items[index] = quote_;
        }

        AsyncStorage.setItem("items", JSON.stringify(items), () => {
          if (!edit) dispatch(addItem(quote_));
          else dispatch(updateItem(quote_));

          navigation.goBack();
        });
      }
    });
  };

  const generateID = () => {
    let d = new Date().getTime();
    let id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(5);
      }
    );

    return id;
  };

  let disabled = publisher.length > 0 && location.length > 0 ? false : true;
  let pubdisabled = publisher.length > 0 ? false : true;
  let locdisabled = location.length > 0 ? false : true;

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Header.HEIGHT}
      style={styles.flex}
      behavior="padding"
    >
      <SafeAreaView style={styles.flex}>
        <View style={styles.flex}>
          <TextInput
            onChangeText={(text) => setPubisher(text)}
            placeholder={"Publisher"}
            style={[styles.textinput]}
            value={publisher}
          />
          {pubdisabled && (
            <Text style={styles.error}>Please enter the publisher</Text>
          )}
          <TextInput
            onChangeText={(text) => setLocation(text)}
            placeholder={"Location"}
            style={[styles.textinput]}
            value={location}
          />
          {locdisabled && (
            <Text style={styles.error}> Please enter the location</Text>
          )}

          <TouchableHighlight
            style={[styles.button]}
            disabled={disabled}
            onPress={onSave}
            underlayColor="rgba(0, 0, 0, 0)"
          >
            <Text
              style={[
                styles.buttonText,
                { color: disabled ? "rgba(255,255,255,.5)" : "#FFF" },
              ]}
            >
              Submit
            </Text>
          </TouchableHighlight>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    padding: 5,
  },

  button: {
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#6B9EFA",
  },

  buttonText: {
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 12,
  },
  textinput: {
    fontSize: 20,
    lineHeight: 22,
    height: 80,
    padding: 16,
    backgroundColor: "white",
  },

  text: {
    fontSize: 30,
    lineHeight: 33,
    color: "#333333",
    padding: 16,
    paddingTop: 16,
    minHeight: 170,
    borderTopWidth: 1,
    borderColor: "rgba(212,211,211, 0.3)",
  },
});
