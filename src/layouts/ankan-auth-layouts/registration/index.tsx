import React from "react";
import { View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  Input,
  StyleService,
  useStyleSheet,
} from "@ui-kitten/components";

import { ImageOverlay } from "./extra/image-overlay.component";
import LinearGradient from "react-native-linear-gradient";
import { KeyboardAvoidingView } from "./extra/3rd-party";

export default ({ navigation }): React.ReactElement => {
  const [firstName, setFirstName] = React.useState<string>();
  const [lastName, setLastName] = React.useState<string>();
  const [email, setEmail] = React.useState<string>();
  const [place, setPlace] = React.useState<string>();
  const [phno, setPhno] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const styles = useStyleSheet(themedStyles);

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
      fetch("https://api.dev.ankanchem.net/users/api/User/Register", {
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
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.title != null) {
            alert(json.title);
            setIsLoading(false);
          } else {
            AsyncStorage.setItem(
              "activationId",
              JSON.stringify(json.activationId)
            );
            AsyncStorage.setItem("userId", JSON.stringify(json.userId));
            navigation && navigation.navigate("OtpScreen");
            setIsLoading(false);
          }
          return json;
        })
        .catch((error) => {
          console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
          console.error("Registration error " + error);
          console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
        });
    }
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
        textContent={"Registering..."}
        textStyle={styles.spinnerTextStyle}
      />
      <View style={[styles.container, styles.formContainer]}>
        <Input
          placeholder="Smith"
          label="FIRST NAME"
          autoCapitalize="words"
          value={firstName}
          onChangeText={setFirstName}
        />
        <Input
          style={styles.formInput}
          placeholder="Watsan"
          label="LAST NAME"
          autoCapitalize="words"
          value={lastName}
          onChangeText={setLastName}
        />
        <Input
          style={styles.formInput}
          placeholder="smith.watsan@gmail.com"
          label="EMAIL"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          style={styles.formInput}
          placeholder="Ernakulam"
          label="PLACE"
          value={place}
          onChangeText={setPlace}
        />
        <Input
          style={styles.formInput}
          placeholder="9998889990"
          label="PHONE NUMBER"
          value={phno}
          onChangeText={setPhno}
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
          onPress={register}
        >
          Get OTP
        </Button>
      </LinearGradient>
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

  spinnerTextStyle: {
    color: "#FFF",
  },
});
