import * as React from "react";
import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";

import PomodoroTimer from "./screens/PomodoroTimer";
import Productivity from "./screens/Productivity";
import TaskBites from "./screens/TaskBites";
import StartTimer from "./screens/StartTimer";
import SettingsPage from "./screens/SettingsPage";
import AccountSettings from "./screens/AccountSettings";
import ManageTask from "./screens/ManageTask";
import Reflect from "./screens/Reflect";
import Goals from "./screens/Goals";
import ReflectionsAgenda from "./screens/ReflectionsAgenda";
import ReflectionView from "./screens/ReflectionView";

import IconButton from "../components/IconButton";
import Icon from "react-native-vector-icons/Ionicons";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import TaskContextProvider from "../store/tasks-context";

import Register from "./screens/Register";
import Login from "./screens/Login";
import { SignInContext } from "../userContexts/Context";
import { Settings } from "react-native";
import ReflectContextProvider from "../store/reflect-context";

import { getCalendars } from "expo-localization";
const settingsPage = "Settings";

const Tab = createBottomTabNavigator();

function localDateToUTCDate(d) {
  const { timeZone } = getCalendars()[0];
  const testD = d.toLocaleString("en-US", {
    timeZone: timeZone,
    hour12: false, // so it's in 24 hours format
  });
  var array = testD.split("/");
  const m = array[0].length == 1 ? "0" + array[0] : array[0];
  const day = array[1];
  const year = array[2].substring(0, 4);
  array = testD.split(":");
  const hours = array[0].substring(array[0].length - 2);
  const minutes = array[1];
  const second = array[2].split(" ")[0];
  const str =
    year +
    "-" +
    m +
    "-" +
    day +
    "T" +
    hours +
    ":" +
    minutes +
    ":" +
    second +
    "Z";
  const currentD = new Date(str);
  return currentD;
}

export function secFromToday(dueDate) {
  var todayD = new Date();
  todayD = localDateToUTCDate(todayD);
  var notifyDate = new Date(
    dueDate.getTime() + dueDate.getTimezoneOffset() * 60000
  );
  notifyDate.setDate(notifyDate.getDate() - 1);
  const tomorrow =
    notifyDate.getFullYear() == todayD.getFullYear() &&
    notifyDate.getDate() == todayD.getDate() &&
    notifyDate.getMonth() == todayD.getMonth();
  if (tomorrow) {
    return 2;
  } else if (notifyDate / 1000 - todayD / 1000 <= 0) {
    return -1;
  } else {
    return notifyDate / 1000 - todayD / 1000;
  }
}

//below handles the taskbar
function Tabs() {
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      //initialRouteName describes the default screen

      initialRouteName={"Login"}
      //screenOptions describes properties for each
      //tab in the navBar.
      //Screenoptions takes in route, which is the current tab.
      //Screenoptions will return an object describing the properties for that tab
      screenOptions={({ route }) => ({
        tabBarButton: [
          //all the screens listed here will not show up in the task bar, but can still be navigated to
          "Register",
          "Login",
          "StartTimer",
          "AccountSettings",
          "Reflect",
          "Goals"
        ].includes(route.name)
          ? () => {
              return null;
            }
          : undefined,
        //tabBarIcon is the icon for each tab in the task bar
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          //if the route or current screen is the pomodoro timer,
          //then highlight the alarm tab IF it is focused.
          //else, just show the outline
          if (rn === "Flow Timer") {
            //focused describes whether the tab is focused or not
            iconName = focused ? "alarm" : "alarm-outline";
          } else if (rn === "Task Bites") {
            iconName = focused ? "ios-newspaper" : "ios-newspaper-outline";
          } else if (rn === "Productivity Scope") {
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          } else if (rn == "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }
          //Ionicons is a library of icons we can use provided by React
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        activeTintColor: "tomato",
        inactiveTintColor: "grey",
        labelStyle: { paddingBottom: 10, fontSize: 10 },
        style: { padding: 10, height: 70 },
      })}
      //below describes all of the screens; define all screens here
      //any new screens you define here, make sure to also define up above
      //                <Tab.Screen name={"Register"} component={Register} options={{ headerShown: false, tabBarStyle: { display: 'none' } }}/>
      //<Tab.Screen name={"Login"} component={Login} options={{ headerShown: false, tabBarStyle: { display: 'none' } }}/>
      //under "tabBarButton"; this ensures that the new screens don't appear on the taskbar
      //Added the settings page as a possible tab, upping the count to 4.
    >
      <Tab.Screen name={"Flow Timer"} component={TimerStack} />
      <Tab.Screen
        name={"Task Bites"}
        component={TaskStack}
        // adds a + on the top right of TaskBites screen that takes to you to the ManageTask Screen
        options={{
          headerRight: () => (
            <IconButton
              icon="add"
              size={24}
              color={"black"}
              onPress={() => {
                navigation.navigate("ManageTask");
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name={"Productivity Scope"}
        component={ProductivityPageStack}
      />
      <Tab.Screen name={"Settings"} component={SettingsStack} />
    </Tab.Navigator>
  );
}

//The stack describes any screens associated with a particular screen.
//Here, this is the stack of screens associated with the flow timer screen.
//The flow timer can either go to itself or the StartTimer screen.
//Define any new screens related to the flow timer screen here.
//Feel free to make a new stack for a new list of screens.
//It's also useful to link screens in a stack, since this is
//how the program determines which screen the "back button" on a phone links to
const Stack = createStackNavigator();
function TimerStack() {
  return (
    <Stack.Navigator initialRouteName="Flow Timer2">
      <Stack.Screen
        name="Flow Timer2"
        component={PomodoroTimer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StartTimer"
        component={StartTimer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Reflect"
        component={Reflect}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const SetStack = createStackNavigator();
function SettingsStack() {
  return (
    <Stack.Navigator initialRouteName="Settings Page">
      <Stack.Screen
        name="Settings Page"
        component={SettingsPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AccountSettings"
        component={AccountSettings}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const ProductivityStack = createStackNavigator();
function ProductivityPageStack() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator initialRouteName="Productivity Page">
      <Stack.Screen
        name="Productivity Page"
        component={Productivity}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Reflections Agenda"
        component={ReflectionsAgenda}
        options={{
          headerLeft: () => (
            <IconButton
              icon="arrow-back"
              size={24}
              color={"black"}
              onPress={() => {
                navigation.navigate("Productivity Page");
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Reflection View"
        component={ReflectionView}
        options={{
          headerLeft: () => (
            <IconButton
              icon="arrow-back"
              size={24}
              color={"black"}
              onPress={() => {
                navigation.navigate("Reflections Agenda");
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Goals"
        component={Goals}
        options={{
          headerLeft: () => (
            <IconButton
              icon="arrow-back"
              size={24}
              color={"black"}
              onPress={() => {
                navigation.navigate("Productivity Page");
              }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

const Auth = createStackNavigator();
function AuthStack() {
  return (
    <Auth.Navigator>
      <Auth.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Auth.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false,
        }}
      />
    </Auth.Navigator>
  );
}

const Stack2 = createStackNavigator();
function TaskStack() {
  return (
    <Stack2.Navigator initialRouteName="Task Bites2">
      <Stack2.Screen
        name="Task Bites2"
        component={TaskBites}
        options={{ headerShown: false }}
      />
      <Stack2.Screen
        name="ManageTask"
        component={ManageTask}
        options={{
          presentation: "transparentModal",
          headerShown: false,
          headerBackVisible: false,
          headerBackTitleVisible: false,
        }}
      />
    </Stack2.Navigator>
  );
}

const MainScreen = createStackNavigator();
function MainStack() {
  return (
    <ReflectContextProvider>
      <MainScreen.Navigator>
        <MainScreen.Screen
          name="Main"
          component={Tabs}
          options={{
            headerShown: false,
          }}
        />
      </MainScreen.Navigator>
    </ReflectContextProvider>
  );
}

export default function MainContainer() {
  const { signedIn } = useContext(SignInContext);
  return (
    <TaskContextProvider>
      <NavigationContainer>
        {signedIn.userToken === null ? <AuthStack /> : <MainStack />}
      </NavigationContainer>
    </TaskContextProvider>
  );
}

// const styles = StyleSheet.create({
//     header: {
//         height: '50%',
//         top: '50%',
//     }
// })
