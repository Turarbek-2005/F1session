import "react-native-gesture-handler";
import React from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { store } from "./screens/store";
import HomeScreen from "./screens/HomeScreen";
import TeamsScreen from "./screens/TeamsScreen";
import DriversScreen from "./screens/DriversScreen";
import DriverDetailScreen from "./screens/DriverDetailScreen";
import TeamDetailScreen from "./screens/TeamDetailScreen";

const Stack = createStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#e10600',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Teams" 
            component={TeamsScreen}
            options={{ title: 'F1 Teams 2025' }}
          />
          <Stack.Screen 
            name="Drivers" 
            component={DriversScreen}
            options={{ title: 'F1 Drivers 2025' }}
          />
          <Stack.Screen 
            name="DriverDetail" 
            component={DriverDetailScreen}
            options={{ title: 'Driver Details' }}
          />
          <Stack.Screen 
            name="TeamDetail" 
            component={TeamDetailScreen}
            options={{ title: 'Team Details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
