import React, { useState, useEffect } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  Divider,
  StyleService,
  Text,
  useStyleSheet,
} from "@ui-kitten/components";

import LinearGradient from "react-native-linear-gradient";

import { FacebookIcon, GoogleIcon, TwitterIcon } from "./extra/icons";
import { KeyboardAvoidingView } from "./extra/3rd-party";

export default ({ navigation }): React.ReactElement => {
  let [isPhoneVarified, setIsPhoneVarified] = React.useState<boolean>(false);
  const [activationId, setActivationId] = React.useState<string>();
  const [activationSecret, setActivationSecret] = React.useState<string>();
  const [id, setId] = React.useState<string>();
  const [userName, setUserName] = React.useState<string>();
  var [userId, setUserId] = React.useState<string>();

  useEffect(() => {
    AsyncStorage.getItem("userId", (err, res) => {
      if (!res) {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("USER ID is Not found");
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
      } else {
        console.log("USER ID " + res);
        setUserId(res);
      }
    });
    AsyncStorage.getItem("id", (err, res) => {
      if (!res) {
        console.warn("id is empty");
      } else {
        setId(res);
        console.info("activation id fetched " + res);
      }
    });
    AsyncStorage.getItem("userName", (err, res) => {
      if (!res) {
        console.warn("user id is empty");
      } else {
        setUserName(res);
        console.info("user id fetched " + res);
      }
    });
    AsyncStorage.getItem("activationId", (err, res) => {
      if (!res) {
        console.warn("activation id is empty");
      } else {
        setActivationId(res);
        console.info("activation id fetched " + res);
      }
    });
    AsyncStorage.getItem("activationSecret", (err, res) => {
      if (!res) {
        console.warn("userName id is empty");
      } else {
        setActivationSecret(res);

        console.info("user id fetched " + res);
      }
    });
  }, []);

  var ShowAlertWithDelay = () => {
    AsyncStorage.setItem("adminApproval", "true");
    console.log(
      "Fetching Bearer token with " +
        userId +
        " " +
        userName +
        " " +
        activationId +
        " " +
        activationSecret
    );

    fetch("https://api.ankanchem.net/users/api/User/VerifyOTP", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IlZHb3BpbmF0aCIsIm5iZiI6MTYyMzEzNjY1MSwiZXhwIjoxNjIzMjIzMDUxLCJpYXQiOjE2MjMxMzY2NTF9.fXmdUO49ayKRrc3zSBJbwaMetTOlMcRzoY4AC7U1Zxs",
      },
      body: JSON.stringify({
        activationId: activationId,
        userId: userId,
        otp: "1111",
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        // alert("in admin screen " + JSON.stringify(json));
        if (json.isPhoneVarified) {
          //  alert("in admin screen " + JSON.stringify(json));

          //  alert("in admin screen " + JSON.stringify(json));

          // AsyncStorage.setItem("id", JSON.stringify(json.id));
          // AsyncStorage.setItem("userName", JSON.stringify(json.userName));
          // // AsyncStorage.setItem(
          //   "activationId",
          //   JSON.stringify(json.activationId)
          // );
          // AsyncStorage.setItem(
          //   "activationSecret",
          //   JSON.stringify(json.activationSecret)
          // );
          AsyncStorage.setItem("screenState", "one");
          AsyncStorage.setItem("userName", json.userName);
          // navigation && navigation.navigate("AdminApproval");
          // setIsLoading(false);
        } else {
          alert("Invalid OTP Entered!! Try Again");
          // setIsLoading(false);
        }
        return json;
      })
      .catch((error) => {
        console.error(error);
      });
    // fetch("https://admin.dev.ankanchem.net/auth/api/Authentication", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer 1234",
    //   },
    //   body: JSON.stringify({
    //     id: id,
    //     userName: userName,
    //     activationId: activationId,
    //     activationSecret: activationSecret,
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((json) => {
    //     if (json.isActive == "true") {
    //       AsyncStorage.setItem("screenState", "two");
    //       navigation && navigation.navigate("Home");
    //     } else {
    //       AsyncStorage.setItem("screenState", "one");
    //       alert("No Access granted, Contact Ankan Admin");
    //     }
    //     //  setIsPhoneVarified = json.isActive;
    //     console.log(json);
    //     //  AsyncStorage.setItem("bearerTocken", JSON.stringify(json.token));
    //     return json;
    //   })
    //   .catch((error) => {
    //     alert("Something went wrong");
    //     AsyncStorage.setItem("screenState", "two");
    //     navigation && navigation.navigate("Home");
    //     console.info("error in authentication tocken api " + error);
    //   });
    // setTimeout(function () {}, 3000);

    console.log("Got Access Key");
  };

  const styles = useStyleSheet(themedStyles);

  const onLogoutPressed = (): void => {
    AsyncStorage.setItem("screenState", "one");
    navigation && navigation.navigate("OtpScreen");
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {!isPhoneVarified && (
        <View style={styles.heading}>
          <Text style={styles.instructions}>
            Grant Access From Admin to Get Started
          </Text>

          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.5, y: 0.9 }}
            locations={[0, 0.5, 0.6]}
            colors={["#0095D9", "#8A2BE2"]}
            style={styles.linearGradient}
          >
            <Button
              style={styles.getOtpButton}
              appearance="ghost"
              status="control"
              size="giant"
              onPress={onLogoutPressed}
            >
              Logout
            </Button>
          </LinearGradient>
        </View>
      )}
      <View style={styles.orContainer}>
        <Divider style={styles.divider} />
        <Text style={styles.orLabel} category="h5">
          OR
        </Text>
        <Divider style={styles.divider} />
      </View>
      <View style={styles.socialAuthContainer}>
        <Text style={styles.socialAuthHintText}>
          Contact Ankan Customer Care
        </Text>
        <View style={styles.socialAuthButtonsContainer}>
          <Button
            appearance="ghost"
            size="giant"
            status="basic"
            accessoryLeft={GoogleIcon}
          />
          <Button
            appearance="ghost"
            size="giant"
            status="basic"
            accessoryLeft={FacebookIcon}
          />
          <Button
            appearance="ghost"
            size="giant"
            status="basic"
            accessoryLeft={TwitterIcon}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: "background-basic-color-1",
  },
  instructions: {
    fontSize: 22,
    fontWeight: "500",
    textAlign: "center",
    color: "#333333",
    marginBottom: 20,
  },

  linearGradient: {
    flex: 1,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 10,
  },

  getOtpButton: {
    flex: 1,
    width: "100%",
    borderRadius: 30,
    justifyContent: "center",
  },
  socialAuthContainer: {
    marginTop: 24,
  },
  socialAuthButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  socialAuthHintText: {
    alignSelf: "center",
    marginBottom: 16,
  },
  heading: {
    margin: 20,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
  },
  divider: {
    flex: 1,
  },
  orLabel: {
    marginHorizontal: 8,
  },
});
