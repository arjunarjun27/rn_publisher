import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  AsyncStorage,
  Button,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { getItems, deleteItem } from "../actions";

import ListItem from "./ListItem";

export default function Home(props) {
  const dispatch = useDispatch();
  const { navigation } = props;

  const [isFetching, setIsFetching] = useState(false);

  const dataReducer = useSelector((state) => state.dataReducer);
  const { items } = dataReducer;

  useEffect(() => getData(), []);

  const getData = () => {
    setIsFetching(true);

    AsyncStorage.getItem("items", (err, items) => {
      if (err) alert(err.message);
      else if (items !== null) dispatch(getItems(JSON.parse(items)));

      setIsFetching(false);
    });
  };

  const renderItem = ({ item, index }) => {
    return (
      <ListItem
        item={item}
        index={index}
        navigation={navigation}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );
  };

  const onEdit = (item) => {
    navigation.navigate("AddNew", { quote: item, title: "Edit Quote" });
  };

  const onDelete = (id) => {
    AsyncStorage.getItem("items", (err, items) => {
      if (err) alert(err.message);
      else if (items !== null) {
        items = JSON.parse(items);

        const index = items.findIndex((obj) => obj.id === id);

        if (index !== -1) items.splice(index, 1);

        AsyncStorage.setItem("items", JSON.stringify(items), () =>
          dispatch(deleteItem(id))
        );
      }
    });
  };

  if (isFetching) {
    return (
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator animating={true} />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Button
          title="New"
          onPress={() => navigation.navigate("AddNew", { title: "New" })}
        />
        {items.length == 0 && (
          <Text style={styles.empty}>No Publisher Found</Text>
        )}
        {items.length !== 0 && (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item, index) => `quotes_${index}`}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  activityIndicatorContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  empty: {
    flex: 1,
    alignSelf: "center",
    alignContent: "stretch",
  },

  floatingButton: {
    backgroundColor: "#6B9EFA",
    borderColor: "#6B9EFA",
    height: 55,
    width: 55,
    borderRadius: 55 / 2,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 60,
    right: 15,
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
});
