import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { store } from "./screens/store";
import HomeScreen from "./screens/HomeScreen";
import TeamsScreen from "./screens/TeamsScreen";
import DriversScreen from "./screens/DriversScreen";
import DriverDetailScreen from "./screens/DriverDetailScreen";
import TeamDetailScreen from "./screens/TeamDetailScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import SettingsScreen from "./screens/SettingsScreen";
import StandingsScreen from "./screens/StandingsScreen";
import RacesScreen from "./screens/RacesScreen";
import ResultsScreen from "./screens/ResultsScreen";
import { loadTokenFromStorage } from "./screens/authSlice";


const Stack = createStackNavigator();

function AppNavigator() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(loadTokenFromStorage());
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#e10600",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Register" }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Sign In" }}
        />
        <Stack.Screen
          name="Teams"
          component={TeamsScreen}
          options={{ title: "F1 Teams 2025" }}
        />
        <Stack.Screen
          name="Drivers"
          component={DriversScreen}
          options={{ title: "F1 Drivers 2025" }}
        />
        <Stack.Screen
          name="DriverDetail"
          component={DriverDetailScreen}
          options={{ title: "Driver Details" }}
        />
        <Stack.Screen
          name="TeamDetail"
          component={TeamDetailScreen}
          options={{ title: "Team Details" }}
        />
        <Stack.Screen
          name="Standings"
          component={StandingsScreen}
          options={{ title: "Standings" }}
        />
        <Stack.Screen
          name="Races"
          component={RacesScreen}
          options={{ title: "Races" }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{ title: "Results" }}
        />
        {user && (
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: "Settings" }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

export default App;
