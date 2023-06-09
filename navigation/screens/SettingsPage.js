import * as React from "react";
import { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Checkbox from "expo-checkbox";
//Replace default useStates with an import from main, once we figure out how the firebase thing works...
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import WorkTimerInput from "../../components/WorkTimerInput";
import BreakTimerInput from "../../components/BreakTimerInput";
import { auth } from "../../firebase/firebase-config";
import { db } from "../../firebase/firebase-config";
import { getDoc, doc, setDoc } from "firebase/firestore/lite";
import { TaskContext } from "../../store/tasks-context";

export default function SettingsPage() {
  const tasksCtx = useContext(TaskContext);

  //Handles notifications for alarm.
  const [enableAlarmNotif, setAlarmNotif] = useState(true);
  //Handles notifications for deadlines.
  const [enableDeadlineNotif, setDeadlineNotif] = useState(true);

  // work timer state (beginning at 25 for default)
  const [defaultWorkTimer, setWorkTimer] = useState("25");
  // break timer state (beginning at 5 for default)
  const [defaultBreakTimer, setBreakTimer] = useState("5");
  // break timer modal useState, initially set to invisible (false)
  const [breakModalIsVisible, setBreakTimerModalIsVisible] = useState(false);
  // work timer modal useState, initially set to invisible (false)
  const [workModalIsVisible, setWorkTimerModalIsVisible] = useState(false);

  const navigation = useNavigation();

  const adjustSettings = async () => {
    try {
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          alarmNotif: enableAlarmNotif,
          deadlineNotif: enableDeadlineNotif,
          workDuration: defaultWorkTimer,
          breakDuration: defaultBreakTimer, // add breakDuration field
        },
        { merge: true }
      );
      console.log("Settings updated successfully.");
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const setDefault = async () => {
    try {
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          alarmNotif: true,
          deadlineNotif: true,
          workDuration: "25",
          breakDuration: "5", // add breakDuration field
        },
        { merge: true }
      );
      console.log("Settings updated successfully.");
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const [initDeadlineNotif, setInitDeadlineNotif] = useState(false);
  const [initAlarmNotif, setInitAlarmNotif] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const docRef = doc(db, "users", auth.currentUser.uid);
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            const alarmNotif = userData.alarmNotif;
            const deadlineNotif = userData.deadlineNotif;
            // console.log("deadlineNotif: ", deadlineNotif);
            const workDuration = userData.workDuration;
            // console.log("workDuration: ", workDuration);
            const breakDuration = userData.breakDuration;
            if (initDeadlineNotif == false) {
              setDeadlineNotif(deadlineNotif);
              setInitDeadlineNotif(true);
            } else if (deadlineNotif != enableDeadlineNotif) {
              setDeadlineNotif(enableDeadlineNotif);
            }
            if (initAlarmNotif == false) {
              setAlarmNotif(alarmNotif);
              setInitAlarmNotif(true);
            } else if (alarmNotif != enableAlarmNotif) {
              setAlarmNotif(enableAlarmNotif);
            }
            setWorkTimer(workDuration);
            setBreakTimer(breakDuration);
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }, [
      enableAlarmNotif,
      enableDeadlineNotif,
      defaultWorkTimer,
      defaultBreakTimer,
    ]) // Add workTimer and breakTimer as dependencies
  );

  // changes work timer value according to user input and then closes the work modal
  function userInputWorkTimer(enteredValue) {
    setWorkTimer(Number(enteredValue));
    endWorkTimerModalHandler();
  }

  // changes break timer value according to user input and then closes the break modal
  function userInputBreakTimer(enteredValue) {
    setBreakTimer(Number(enteredValue));
    endBreakTimerModalHandler();
  }

  // updating function to update whether Work Timer Modal is visible
  function startWorkTimerModalHandler() {
    setWorkTimerModalIsVisible(true);
  }

  // function to close the Work Timer Modal (make it invisible)
  function endWorkTimerModalHandler() {
    setWorkTimerModalIsVisible(false);
  }

  // updating function to update whether Work Timer Modal is visible
  function startBreakTimerModalHandler() {
    setBreakTimerModalIsVisible(true);
  }

  // function to close the Work Timer Modal (make it invisible)
  function endBreakTimerModalHandler() {
    setBreakTimerModalIsVisible(false);
  }

  function accountSettingsHandler() {
    navigation.navigate("AccountSettings", {});
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Change Default Options</Text>
      {/*Checkbox for Enabling Alarm Notifications*/}
      <View style={styles.section}>
        <Checkbox
          style={styles.checkbox}
          value={enableAlarmNotif}
          onValueChange={() => {
            setAlarmNotif(!enableAlarmNotif);
          }}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setAlarmNotif(!enableAlarmNotif);
          }}
        >
          <Text style={styles.paragraph}>Enable Notifications for Alarms</Text>
        </TouchableOpacity>
      </View>
      {/*Checkbox for Enabling Deadline Notifications*/}
      <View style={styles.section}>
        <Checkbox
          style={styles.checkbox}
          value={enableDeadlineNotif}
          onValueChange={() => {
            setDeadlineNotif(!enableDeadlineNotif);
          }}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setDeadlineNotif(!enableDeadlineNotif);
          }}
        >
          <Text style={styles.paragraph}>
            Enable Notifications for Deadlines
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          style={styles.buttonConfirm}
          onPress={() => {
            adjustSettings();
            if (enableDeadlineNotif == false) {
              tasksCtx.cancelAllNotif();
            } else {
              tasksCtx.enableAllNotif();
            }
          }}
        >
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.midcontainer}>
        <Text style={styles.titleText}>Set Default Work Time</Text>
        {/* Creates a custom button that activates modal for user to use to set custom work timer*/}
        <Pressable
          visible={workModalIsVisible}
          onPress={startWorkTimerModalHandler}
        >
          <View>
            <Text style={styles.timerText}>{defaultWorkTimer} Minutes</Text>
          </View>
        </Pressable>
        {/* The custom modal to allow user to change Work Timer value */}
        <WorkTimerInput
          // passes value to make modal visible
          visible={workModalIsVisible}
          // passes function that closes modal
          onCancel={endWorkTimerModalHandler}
          // passes function that handles user input, then closes modal
          onSubmit={userInputWorkTimer}
          // passes default value of Work Timer (whatever was previously entered, default starting at 25)
          defaultValues={defaultWorkTimer}
        />
        <Text style={styles.titleText}>Set Default Break Time</Text>
        {/* Creates a custom button that activates modal for user to use to set custom break timer */}
        <Pressable
          visible={breakModalIsVisible}
          onPress={startBreakTimerModalHandler}
        >
          <View>
            <Text style={styles.timerText}>{defaultBreakTimer} Minutes</Text>
          </View>
        </Pressable>
        {/* The custom modal to allow user to change Break Timer value    */}
        <BreakTimerInput
          // passes value to make modal visible
          visible={breakModalIsVisible}
          // passes function to close modal
          onCancel={endBreakTimerModalHandler}
          // passes function that handles user input, then closes modal
          onSubmit={userInputBreakTimer}
          // passes default value of Break Timer (whatever was previously entered, default starting at 5)
          defaultValues={defaultBreakTimer}
        />
        {/*Navigation to Account Settings*/}
      </View>
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.buttonConfirm}
          onPress={accountSettingsHandler}
        >
          <Text style={styles.optionsText}>Account Settings</Text>
        </TouchableOpacity>
        {/*Button to Restore Defaults*/}
        <TouchableOpacity
          style={styles.buttonRestore}
          onPress={() => {
            setAlarmNotif(true);
            setDeadlineNotif(true);
            setWorkTimer(25);
            setBreakTimer(5);
            setDefault();
          }}
        >
          <Text style={styles.optionsText}>Restore Defaults</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
//TODO
//Option to toggle notifications for alarm (1 h)
//Option to toggle notifications for deadlines (2 h)
//Option to change work/break timer (how long it is - default settings) (2 h)

const styles = StyleSheet.create({
  titleText: {
    fontWeight: "bold",
    fontSize: 30,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 5,
  },

  timerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fbc4ab",
  },

  timerText: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    fontSize: 25,
    borderRadius: 30,
    padding: 10,
    backgroundColor: "#f4978e",
    borderWidth: 5,
    borderColor: "#f08080",
    fontWeight: "bold",
    opacity: 0.8,
    overflow: "hidden",
  },

  container: {
    flex: 1,
    backgroundColor: "#FBC4AB",
  },

  midcontainer: {
    flex: 1,
    backgroundColor: "#FBC4AB",
    alignItems: "center",
  },

  section: {
    flexDirection: "row",
    alignItems: "center",
  },

  paragraph: {
    fontSize: 20,
    alignItems: "center",
  },

  confirmText: {
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    fontSize: 20,
    borderRadius: 25,
    padding: 10,
    backgroundColor: "#f4978e",
    borderWidth: 5,
    borderColor: "#f08080",
    fontWeight: "bold",
    opacity: 0.8,
    overflow: "hidden",
  },

  optionsText: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    fontSize: 18,
    borderRadius: 25,
    padding: 10,
    backgroundColor: "#f4978e",
    borderWidth: 5,
    borderColor: "#f08080",
    fontWeight: "bold",
    opacity: 0.8,
    overflow: "hidden",
  },

  checkbox: {
    margin: 20,
    alignItems: "center",
  },

  buttonRestore: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FBC4AB",
  },

  buttonConfirm: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FBC4AB",
  },
});
