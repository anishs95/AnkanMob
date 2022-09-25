import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  Input,
  StyleService,
  useStyleSheet,
  Card,
  Text,
} from "@ui-kitten/components";

import ModalDropdown from "react-native-modal-dropdown";
import { ImageOverlay } from "./extra/image-overlay.component";
import LinearGradient from "react-native-linear-gradient";
import { KeyboardAvoidingView } from "./extra/3rd-party";

export default ({ navigation }): React.ReactElement => {
  const [scrState, setScrState] = React.useState<string>();
  var [location, setLocation] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [locationList, setLocationList] = useState([]);
  var [place, setPlace] = React.useState<string>();

  const styles = useStyleSheet(themedStyles);
  const [locationId, setLocationId] = useState();

  useEffect(() => {
    AsyncStorage.getItem("screenState", (err, res) => {
      if (!res) {
        navigation && navigation.navigate("RegistarationScreen");
        console.warn("screenState is empty");
      } else {
        console.info("screenState  fetched " + res);
        // setScrState(JSON.parse(res));
        if (res === "one") {
          navigation && navigation.navigate("AdminApproval");
        } else if (res === "two") {
          navigation && navigation.navigate("Home");
        } else {
          navigation && navigation.navigate("RegistarationScreen");
        }
      }
    });

    fetch("https://api.ankanchem.net/location/api/Location/GetLocations")
      .then((response) => response.json())
      .then((json) => setLocationList(json))
      .catch((error) => console.error(error));
    //.finally(() => setLoading(false));
  }, []);

  const register = (): void => {
    navigation.goBack();
  };
  return (
    <KeyboardAvoidingView style={styles.container}>
      <Spinner
        overlayColor="rgba(0, 0, 0, 0.6)"
        size="large"
        visible={isLoading}
        textContent={"Calculating..."}
        textStyle={styles.spinnerTextStyle}
      />
    </KeyboardAvoidingView>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: "background-basic-color-1",
  },
  headerContainer: {
    minHeight: 216,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 44,
    radius: 20,
  },
  bookingCard: {
    margin: 4,
  },

  getOtpButton: {
    width: "100%",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  formContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  dropdown_5: {
    marginTop: 8,
    borderColor: "lightgray",
    height: 40,
    backgroundColor: "#f8f9fd",
    borderWidth: 0.5,
    borderRadius: 5,
    padding: 8,
    paddingLeft: 20,
  },
  signUpButton: {
    marginVertical: 34,
    marginHorizontal: 26,
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  formInput: {
    marginTop: 16,
  },
  formInput2: {
    marginTop: 16,
    fontSize: 12,
  },

  spinnerTextStyle: {
    color: "#FFF",
  },
  dropdown_2_text: {
    fontSize: 14,
    color: "#120",
    textAlign: "center",
    textAlignVertical: "center",
  },
  dropdown_3_dropdownTextStyle: {
    marginHorizontal: 16,
    fontSize: 12,
  },
  formInput3: {
    fontSize: 12,
  },
  button: {
    alignItems: "center",
    padding: 1,
  },
});
