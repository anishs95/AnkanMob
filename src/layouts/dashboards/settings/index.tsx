import React from "react";
import { StyleSheet, Alert } from "react-native";
import { Layout, Toggle } from "@ui-kitten/components";
import { Setting } from "./extra/settings-section.component";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default ({ navigation }): React.ReactElement => {
  const [soundEnabled, setSoundEnabled] = React.useState<boolean>(false);

  const toggleSound = (): void => {
    Alert.alert("LOGOUT !!!", "Are you sure to logout", [
      {
        text: "Ask me later",
        onPress: () => console.log("Ask me later pressed"),
      },
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          AsyncStorage.setItem("screenState", "four");
          navigation.reset({
            index: 0,
            routes: [{ name: "LoginScreen" }],
          });
          // navigation && navigation.navigate("LoginScreen");
        },
      },
    ]);
    setSoundEnabled(!soundEnabled);
  };

  return (
    <Layout style={styles.container}>
      <Setting style={styles.setting} hint="Logout" onPress={toggleSound} />
      {/* <Setting style={styles.setting} hint="Change Password" />
      <Setting style={[styles.setting, styles.section]} hint="Notification" />
      <Setting style={styles.setting} hint="Privacy" />
      <Setting
        style={[styles.setting, styles.section]}
        hint="Sound Enabled"
        onPress={toggleSound}
      >
        <Toggle checked={soundEnabled} onChange={toggleSound} />
      </Setting> */}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  setting: {
    padding: 16,
  },
  section: {
    paddingTop: 32,
  },
});
