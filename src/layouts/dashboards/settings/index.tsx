import React, { useEffect, useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { Layout, Toggle } from "@ui-kitten/components";
import { Setting } from "./extra/settings-section.component";
import ModalDropdown from "react-native-modal-dropdown";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default ({ navigation }): React.ReactElement => {
  const [soundEnabled, setSoundEnabled] = React.useState<boolean>(false);
  const [locationList, setLocationList] = useState([]);
  var [place, setPlace] = React.useState<string>();
  const [locationId, setLocationId] = useState();

  useEffect(() => {
    fetch("https://api.ankanchem.net/location/api/Location/GetLocations")
      .then((response) => response.json())
      .then((json) => setLocationList(json))
      .catch((error) => console.error(error));
    //.finally(() => setLoading(false));
  }, []);

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
      <Setting style={styles.setting} hint="Change Location" />
      <ModalDropdown
        options={locationList.map((value, index) => {
          // place = value.id;
          return value.locationName;
        })}
        // dropdownTextStyle={styles.dropdown_3_dropdownTextStyle}
        style={styles.dropdown_5}
        isFullWidth
        textStyle={styles.dropdown_2_text}
        onSelect={(index3, value3) => {
          AsyncStorage.setItem("locationId", locationList[index3].id);
          AsyncStorage.setItem("place", value3);
        }}
      />
      <Setting style={styles.setting} hint="Logout" onPress={toggleSound} />
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
  dropdown_2_text: {
    fontSize: 12,
    color: "#120",
    textAlign: "center",
    textAlignVertical: "center",
  },
  dropdown_3_dropdownTextStyle: {
    marginHorizontal: 1,
    fontSize: 12,
  },
  dropdown_5: {
    marginHorizontal: 2,
    borderColor: "lightgray",
    height: 40,
    backgroundColor: "#f8f9fd",
    borderWidth: 0.75,
    borderRadius: 5,
    padding: 8,
    paddingLeft: 20,
  },
});
