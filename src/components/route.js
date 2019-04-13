import { createStackNavigator, createAppContainer } from "react-navigation";
import Home from "./Home/Home";

const AppRouter = createStackNavigator({
  Home: { screen: Home }
});

export default createAppContainer(AppRouter);
