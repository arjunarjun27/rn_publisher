import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import LoadingScreen from "./LoadingScreen";
import HomeScreen from "./Home";
import AddNewScreen from "./AddNew";

const AppStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      title: `Home`,
    }),
  },
  AddNew: {
    screen: AddNewScreen,
    navigationOptions: ({ navigation }) => ({
      title: `New `,
    }),
  },
});

const RoutesStack = createSwitchNavigator(
  {
    Loading: LoadingScreen,
    App: AppStack,
  },
  { initialRouteName: "Loading" }
);

const Router = createAppContainer(RoutesStack);

export default Router;
