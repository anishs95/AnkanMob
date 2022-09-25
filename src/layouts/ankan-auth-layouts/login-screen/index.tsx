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
  const [phno, setPhno] = React.useState<string>();
  var [location, setLocation] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [locationList, setLocationList] = useState([]);
  var [place, setPlace] = React.useState<string>();

  const styles = useStyleSheet(themedStyles);
  const [locationId, setLocationId] = useState();

  useEffect(() => {
    fetch("https://api.ankanchem.net/location/api/Location/GetLocations")
      .then((response) => response.json())
      .then((json) => setLocationList(json))
      .catch((error) => console.error(error));
    //.finally(() => setLoading(false));
  }, []);
  const login = (): void => {
    if (phno == null || place == null) {
      alert("Empty Fields");
    } else {
      fetch("https://api.ankanchem.net/users/api/User/GetOTP/" + phno, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + "1234",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          //  alert(JSON.stringify(json));
          AsyncStorage.setItem("activationId", json.activationId);
          AsyncStorage.setItem("userId", json.userId);
          AsyncStorage.setItem("locationId", locationId);
          AsyncStorage.setItem("place", place);
          navigation && navigation.navigate("OtpScreen");
          // setData(json);
          return json;
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => setIsLoading(false));
      setIsLoading(true);
    }
  };
  const register = (): void => {
    AsyncStorage.setItem("screenState", "nine");
    navigation.navigate("Registration");
  };
  return (
    <KeyboardAvoidingView style={styles.container}>
      <ImageOverlay
        style={styles.headerContainer}
        source={require("./assets/reg.png")}
      ></ImageOverlay>

      <Spinner
        overlayColor="rgba(0, 0, 0, 0.6)"
        size="large"
        visible={isLoading}
        textContent={"Logging..."}
        textStyle={styles.spinnerTextStyle}
      />
      <View style={[styles.container, styles.formContainer]}>
        <Input
          style={styles.formInput}
          placeholder="9998889990"
          label="PHONE NUMBER"
          keyboardType="numeric"
          value={phno}
          onChangeText={setPhno}
        />

        <Text style={styles.formInput2} appearance={"hint"}>
          LOCATION
        </Text>
        {/* <Text>{JSON.stringify(value.types)}</Text> */}
        {/* {setTemp(value.types)} */}

        <ModalDropdown
          options={locationList.map((value, index) => {
            // place = value.id;
            return value.locationName;
          })}
          // dropdownTextStyle={styles.dropdown_3_dropdownTextStyle}
          style={styles.dropdown_5}
          isFullWidth
          saveScrollPosition="true"
          textStyle={styles.dropdown_2_text}
          onSelect={(index3, value3) => {
            setLocationId(locationList[index3].id);
            setPlace(value3);
          }}
        />
      </View>

      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.5, y: 0.9 }}
        locations={[0, 0.5, 0.6]}
        colors={["#0095D9", "#8A2BE2"]}
        style={styles.signUpButton}
      >
        <Button
          style={styles.getOtpButton}
          appearance="ghost"
          status="control"
          size="giant"
          onPress={login}
        >
          Get OTP
        </Button>
      </LinearGradient>
      <TouchableOpacity style={styles.button} onPress={register}>
        <Text appearance={"default"} status="primary" style={styles.formInput3}>
          Not a member Yet? REGISTER HERE
        </Text>
      </TouchableOpacity>
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
    borderRadius: 10,
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
    marginHorizontal: 40,
    borderRadius: 10,
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
    fontSize: 13,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  button: {
    alignItems: "center",
    padding: 1,
  },
});
