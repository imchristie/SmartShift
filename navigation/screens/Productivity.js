import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { ReflectContext } from "../../store/reflect-context";
import { useState, useEffect, useContext } from "react";

function Productivity({ route, navigation }) {
  const reflectCtx = useContext(ReflectContext);

  const numOfReflections = reflectCtx.reflections.length;

  const reflectionsExist = numOfReflections > 0;

  function showReflectionsHandler() {
    navigation.navigate("Reflections Agenda");
  }

  function showGoals() {
    navigation.navigate("Goals");
  }

  return (
    <View style={styles.timerContainer}>
      {/* <Text style={styles.timerText}>Main Productivity Page</Text> */}
      <Text style={styles.text}>
        There are currently {numOfReflections} reflections created!
      </Text>
      {reflectionsExist && (
        <View>
          <Pressable onPress={showReflectionsHandler}>
            <Text style={styles.button}>View Reflections</Text>
          </Pressable>
        </View>
        
      )}
        <View>
          <Pressable onPress={showGoals}>
            <Text style={styles.button}>View Goals</Text>
          </Pressable>
        </View>
    </View>
  );
}

export default Productivity;

const styles = StyleSheet.create({
  timerContainer: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#fbc4ab",
  },
  timerText: {
    fontSize: 26,
    fontWeight: "bold",
  },
  text: {
    marginVertical: 10,
    fontSize: 20,
    textAlignVertical: "top",
  },
  safe: {
    flex: 1,
    backgroundColor: "#fbc4ab",
  },
  itemContainer: {
    backgroundColor: "white",
    margin: 5,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    fontSize: 26,
    borderRadius: 30,
    padding: 10,
    backgroundColor: "#f4978e",
    borderWidth: 5,
    borderColor: "#f08080",
    fontWeight: "bold",
    opacity: 0.8,
    overflow: "hidden",
  },
});
