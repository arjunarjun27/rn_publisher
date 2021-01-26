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

import { addQuotes, deleteQuote } from "../actions";

import ListItem from "./ListItem";

export default function Home(props) {
  const dispatch = useDispatch();
  const { navigation } = props;

  const [isFetching, setIsFetching] = useState(false);

  const dataReducer = useSelector((state) => state.dataReducer);
  const { quotes } = dataReducer;

  useEffect(() => getData(), []);

  const getData = () => {
    setIsFetching(true);

    AsyncStorage.getItem("quotes", (err, quotes) => {
      if (err) alert(err.message);
      else if (quotes !== null) dispatch(addQuotes(JSON.parse(quotes)));

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
    navigation.navigate("NewQuote", { quote: item, title: "Edit Quote" });
  };

  const onDelete = (id) => {
    AsyncStorage.getItem("quotes", (err, quotes) => {
      if (err) alert(err.message);
      else if (quotes !== null) {
        quotes = JSON.parse(quotes);

        const index = quotes.findIndex((obj) => obj.id === id);

        if (index !== -1) quotes.splice(index, 1);

        AsyncStorage.setItem("quotes", JSON.stringify(quotes), () =>
          dispatch(deleteQuote(id))
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
          onPress={() => navigation.navigate("NewQuote", { title: "New" })}
        />
        {quotes.length == 0 && (
          <Text style={styles.empty}>No Publisher Found</Text>
        )}
        {quotes.length !== 0 && (
          <FlatList
            data={quotes}
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
