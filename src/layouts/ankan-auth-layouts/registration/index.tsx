import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
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
  const [firstName, setFirstName] = React.useState<string>();
  const [lastName, setLastName] = React.useState<string>();
  const [email, setEmail] = React.useState<string>();
  var [place, setPlace] = React.useState<string>();
  const [phno, setPhno] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isLoading2, setIsLoading2] = React.useState<boolean>(true);
  const [locationList, setLocationList] = useState([]);
  const styles = useStyleSheet(themedStyles);
  const [locationId, setLocationId] = useState();

  useEffect(() => {
    fetch("https://api.ankanchem.net/location/api/Location/GetLocations")
      .then((response) => response.json())
      .then((json) => setLocationList(json))
      .catch((error) => console.error(error));

    AsyncStorage.getItem("screenState", (err, res) => {
      if (!res) {
        console.warn("screenState is empty");
        setIsLoading2(false);
      } else {
        console.info("screenState  fetched " + res);
        // setScrState(JSON.parse(res));
        if (res === "one") {
          navigation && navigation.navigate("OtpScreen");
        } else if (res === "two") {
          navigation && navigation.navigate("AdminApproval");
        } else if (res === "three") {
          navigation && navigation.navigate("Home");
        } else if (res === "four") {
          navigation && navigation.navigate("LoginScreen");
        } else {
          navigation && navigation.navigate("Registration");
        }
        setIsLoading2(false);
      }
    });
  }, []);

  const register = (): void => {
    if (
      firstName == null ||
      lastName == null ||
      email == null ||
      place == null
    ) {
      alert("Empty Fields");
    } else {
      setIsLoading(true);
      fetch("https://api.ankanchem.net/users/api/User/Register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IlZHb3BpbmF0aCIsIm5iZiI6MTYyMzEzNjY1MSwiZXhwIjoxNjIzMjIzMDUxLCJpYXQiOjE2MjMxMzY2NTF9.fXmdUO49ayKRrc3zSBJbwaMetTOlMcRzoY4AC7U1Zxs",
        },
        body: JSON.stringify({
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          PhoneNumber: phno,
          City: place,
          roles: ["TileContractor"],
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.title != null) {
            alert(json.title);
            setIsLoading(false);
          } else {
            AsyncStorage.setItem("activationId", json.activationId);
            AsyncStorage.setItem("userId", json.userId);
            AsyncStorage.setItem("locationId", locationId);
            AsyncStorage.setItem("phoneNumber", phno);
            AsyncStorage.setItem("place", place);
            AsyncStorage.setItem("screenState", "one");
            console.log(
              "Registration completd..." +
                JSON.stringify(json) +
                "with location id" +
                locationId
            );
            navigation && navigation.navigate("OtpScreen");
            setIsLoading(false);
          }
          return json;
        })
        .catch((error) => {
          alert("Already registerd user , Try Log IN");
          console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
          console.error("Registration error " + error);
          console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
          setIsLoading(false);
        });
    }
  };

  const login = (): void => {
    navigation && navigation.navigate("LoginScreen");
  };

  return (
    <View>
      {isLoading2 ? (
        <View></View>
      ) : (
        <KeyboardAvoidingView style={styles.container}>
          <ImageOverlay
            style={styles.headerContainer}
            source={require("./assets/reg.png")}
          ></ImageOverlay>
          <Spinner
            overlayColor="rgba(0, 0, 0, 0.6)"
            size="large"
            visible={isLoading2}
            textContent={"Page..."}
            textStyle={styles.spinnerTextStyle}
          />
          <Spinner
            overlayColor="rgba(0, 0, 0, 0.6)"
            size="large"
            visible={isLoading}
            textContent={"Registering..."}
            textStyle={styles.spinnerTextStyle}
          />
          <ScrollView style={[styles.container2, styles.formContainer]}>
            <Input
              label="FIRST NAME"
              autoCapitalize="words"
              value={firstName}
              onChangeText={setFirstName}
            />
            <Input
              style={styles.formInput}
              label="LAST NAME"
              autoCapitalize="words"
              value={lastName}
              onChangeText={setLastName}
            />
            <Input
              style={styles.formInput}
              keyboardType="email-address"
              label="EMAIL"
              value={email}
              onChangeText={setEmail}
            />
            <View>
              <Text style={styles.formInput2} appearance={"hint"}>
                LOCATION
              </Text>
              <ModalDropdown
                options={locationList.map((value, index) => {
                  return value.locationName;
                })}
                // dropdownTextStyle={styles.dropdown_3_dropdownTextStyle}
                style={styles.dropdown_5}
                isFullWidth
                textStyle={styles.dropdown_2_text}
                onSelect={(index3, value3) => {
                  setLocationId(locationList[index3].id);
                  setPlace(value3);
                }}
              />
            </View>

            <Input
              style={styles.formInput}
              label="PHONE NUMBER"
              keyboardType="numeric"
              maxLength={10}
              value={phno}
              onChangeText={setPhno}
            />
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
                onPress={register}
              >
                Get OTP
              </Button>
            </LinearGradient>
            <TouchableOpacity style={styles.button} onPress={login}>
              <Text
                appearance={"default"}
                status="primary"
                style={styles.formInput3}
              >
                Already a member? LOG IN
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: "background-basic-color-1",
  },
  container2: {
    radius: 60,
    flex: 2,
    paddingBottom: 40,
  },
  headerContainer: {
    minHeight: 216,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 44,
    radius: 60,
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
    marginVertical: 30,
    marginHorizontal: 26,
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
    padding: 0,
  },
});
