import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import {
  Button,
  Divider,
  StyleService,
  Text,
  useStyleSheet,
} from "@ui-kitten/components";
import OTPTextView from "react-native-otp-textinput";
import LinearGradient from "react-native-linear-gradient";

import { FacebookIcon, GoogleIcon, TwitterIcon } from "./extra/icons";
import { KeyboardAvoidingView } from "./extra/3rd-party";

export default ({ navigation }): React.ReactElement => {
  let [otpNumber, setOtpNumber] = React.useState<string>();
  let [isPhoneVarified, setIsPhoneVarified] = React.useState<boolean>(false);
  var [activationId, setActivationId] = React.useState<string>();
  var [userId, setUserId] = React.useState<string>();
  var [phoneNumber, setPhoneNumber] = React.useState<string>();
  const [spinner, setSpinner] = React.useState<Boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem("activationId", (err, res) => {
      if (!res) {
        console.log("Activation ID is Not found");
      } else {
        setActivationId(res);
      }
    });
    AsyncStorage.getItem("userId", (err, res) => {
      if (!res) {
        console.log("USER ID is Not found");
      } else {
        setUserId(res);
      }
    });
    AsyncStorage.getItem("phoneNumber", (err, res) => {
      if (!res) {
        console.log("USER ID is Not found");
      } else {
        setPhoneNumber(res);
      }
    });
  }, [activationId]);

  const styles = useStyleSheet(themedStyles);

  const onOTPentered = (): void => {
    setIsLoading(true);
    setTimeout(function () {
      console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log("Otp ID > " + otpNumber);
      console.log("Activation ID > " + activationId);
      console.log("User ID > " + userId);
      console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");

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
          otp: otpNumber,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          //  alert(JSON.stringify(json));
          if (json.isPhoneVarified) {
            console.log("in otp screen " + JSON.stringify(json));
            AsyncStorage.setItem("id", json.id);
            AsyncStorage.setItem("userName", json.userName);
            AsyncStorage.setItem("activationId", json.activationId);
            AsyncStorage.setItem("activationSecret", json.activationSecret);
            AsyncStorage.setItem("userName", json.userName);
            if (json.isActive) {
              AsyncStorage.setItem("screenState", "three");
              navigation && navigation.navigate("Home");
            } else {
              AsyncStorage.setItem("screenState", "two");
              navigation && navigation.push("AdminApproval");
            }

            setIsLoading(false);
          } else {
            alert("Invalid OTP Entered!! Try Again");
            setIsLoading(false);
          }
          return json;
        })
        .catch((error) => {
          console.error(error);
        });
    }, 2000);
  };

  const onOTPentered2 = (): void => {
    fetch("https://api.ankanchem.net/users/api/User/GetOTP/" + phoneNumber, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + "1234",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        AsyncStorage.setItem("activationId", json.activationId);
        setActivationId(json.activationId);
        return json;
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
    setIsLoading(true);
  };

  const otpVerification = (): void => {};

  return (
    <KeyboardAvoidingView style={styles.container}>
      {!isPhoneVarified && (
        <View style={styles.heading}>
          <Text style={styles.instructions}>Enter OTP</Text>
          <Spinner
            overlayColor="rgba(0, 0, 0, 0.7)"
            size="large"
            visible={isLoading}
            textContent={"Verifying OTP..."}
            textStyle={styles.spinnerTextStyle}
          />
          <OTPTextView
            handleTextChange={(e) => {
              setOtpNumber(e);
            }}
            containerStyle={styles.textInputContainer}
            textInputStyle={[styles.roundedTextInput, { borderRadius: 150 }]}
            tintColor="#0095D9"
            width={60}
            height={60}
            color="#0010000"
          />

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
              onPress={() => {
                onOTPentered();
              }}
            >
              VERIFY OTP
            </Button>
          </LinearGradient>
          <TouchableOpacity style={styles.button} onPress={onOTPentered2}>
            <Text
              appearance={"default"}
              status="primary"
              style={styles.formInput3}
            >
              Resend OTP
            </Text>
          </TouchableOpacity>
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
          Sign with a social account
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
  textInputContainer: {
    marginBottom: 20,
  },
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: 4,
  },
  container1: {
    flex: 2,
    justifyContent: "center",
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
    // paddingLeft: 15,
    // paddingRight: 15,
    borderRadius: 10,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  getOtpButton: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    // marginTop: 30,
    // marginHorizontal: 26,
    // backgroundColor: "#ffa",
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

  signUpButton: {
    marginVertical: 24,
    marginHorizontal: 16,
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
  spinnerTextStyle: {
    color: "#FFF",
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
