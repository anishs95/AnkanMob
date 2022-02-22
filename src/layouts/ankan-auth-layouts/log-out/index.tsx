import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, SafeAreaView } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  Divider,
  StyleService,
  Text,
  useStyleSheet,
} from "@ui-kitten/components";
import OTPTextView from "react-native-otp-textinput";

import { FacebookIcon, GoogleIcon, TwitterIcon } from "./extra/icons";
import { KeyboardAvoidingView } from "./extra/3rd-party";

export default ({ navigation }): React.ReactElement => {
  let [otpNumber, setOtpNumber] = React.useState<string>();
  let [isPhoneVarified, setIsPhoneVarified] = React.useState<boolean>(false);
  const phoneInput = useRef<PhoneInput>(null);
  const [activationId, setActivationId] = React.useState<string>();
  const [userId, setUserId] = React.useState<string>();
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  useEffect(() => {
    // getData();
  }, []);

  // const getData = async () => {
  //   try {
  //     activa = await AsyncStorage.getItem("activationId");
  //     user = await AsyncStorage.getItem("userId");
  //     // setActivationId =
  //     //   activationId1 != null ? JSON.parse(activationId1) : null;
  //     // setUserId = activationId1 != null ? JSON.parse(userId1) : null;
  //     // console.log("activation id --> " + activationId);
  //     // console.log("user id --> " + userId);
  //   } catch (e) {
  //     console.log("error in reading user name and activation id 2");
  //   }
  // };
  const onSignInButtonPress = (): void => {
    navigation && navigation.navigate("Otp");
  };
  setTimeout(() => {
    AsyncStorage.getItem("activationId", (err, res) => {
      if (!res) {
        console.log("activation id is empty");
      } else {
        // AsyncStorage.setItem("@cartProductId", JSON.stringify([1, 2, 3]));
        setActivationId(JSON.parse(res));
        console.log("activation id fetched " + res);
      }
    });
    AsyncStorage.getItem("userId", (err, res) => {
      if (!res) {
        console.log("user id is empty");
      } else {
        // AsyncStorage.setItem("@cartProductId", JSON.stringify([1, 2, 3]));
        setUserId(JSON.parse(res));
        console.log("user id fetched " + res);
      }
    });
  }, 2000);

  var ShowAlertWithDelay = () => {
    setTimeout(function () {
      // getData();
    }, 2000);
  };

  ShowAlertWithDelay();

  const styles = useStyleSheet(themedStyles);

  const onSignUpButtonPress = (): void => {
    // if (otpNumber.length != 4) {
    //   alert("invalid otp");
    // } else {
    console.log("otp id fetched " + `"${otpNumber}"`);
    console.log("activat id fetched " + activationId);
    console.log("yser id fetched " + userId);
    fetch(
      "https://wlqvdegwrf.execute-api.ap-south-1.amazonaws.com/alpha/api/User/VerifyOTP",
      {
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
      }
    )
      .then((response) => response.json())
      .then((json) => {
        // console.log(json.movies);
        // AsyncStorage.setItem("activationId", json.activationId);
        // AsyncStorage.setItem("userId", json.userId);
        if (json.isPhoneVarified) {
          navigation && navigation.navigate("OtpVerified");
        } else {
          alert("invalid OTP Entered");
        }

        setIsPhoneVarified = json.isPhoneVarified;
        console.log(JSON.stringify(json.isPhoneVarified));
        console.log(JSON.stringify(json));
        console.log(json.isPhoneVarified);

        return json;
      })
      .catch((error) => {
        console.error(error);
      });

    console.log("namvigated sucess");
    // navigation && navigation.navigate("Otp");
    // }

    navigation && navigation.navigate("Home");
  };

  const otpVerification = (): void => {};

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.title}>ANKAN</Text>
      <Text appearance="hint" category="s1" style={styles.subTitle}>
        Enhancing & providing the comprehensive solutions in the construction
        industry and aromatic chemicals – flavour arena
      </Text>
      <View style={styles.phoneContainer}>
        <PhoneInput
          ref={phoneInput}
          defaultCode="IN"
          layout="first"
          textContainerStyle={{ height: 70 }}
          textInputProps={{
            selectionColor: "#111",
            keyboardType: "phone-pad",
          }}
          onChangeText={(text) => {
            setValue(text);
          }}
          onChangeFormattedText={(text) => {
            setFormattedValue(text);
          }}
          withDarkTheme
          withShadow
        />

        <TouchableOpacity
          onPress={() => {
            const checkValid = phoneInput.current?.isValidNumber(value);
            setShowMessage(true);
            setValid(checkValid ? checkValid : false);
          }}
        ></TouchableOpacity>

        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.5, y: 0.9 }}
          locations={[0, 0.5, 0.6]}
          colors={["#0095D9", "#8A2BE2"]}
          style={styles.linearGradient1}
        >
          <Button
            style={styles.getOtpButton}
            appearance="ghost"
            status="control"
            size="giant"
            onPress={onSignInButtonPress}
          >
            Get OTP
          </Button>
        </LinearGradient>
      </View>
      {!isPhoneVarified && (
        <View style={styles.heading}>
          <Text style={styles.instructions}>Enter OTP</Text>
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
              onPress={onSignUpButtonPress}
            >
              Verify OTP
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
  title: {
    color: "#0095D9",
    fontWeight: "bold",
    marginTop: 8,
    padding: 16,
    justifyContent: "center",
    textAlign: "center",
    fontSize: 54,
  },
  subTitle: {
    paddingLeft: 40,
    paddingRight: 40,
    justifyContent: "center",
    textAlign: "center",
    fontSize: 12,
  },
  phoneContainer: {
    alignItems: "center",
    width: "100%",
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 30,
  },
  textInputContainer: {
    marginBottom: 20,
  },
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: 4,
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
    borderRadius: 65,
  },
  linearGradient1: {
    margin: 20,
    width: "75%",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    // paddingLeft: 15,
    // paddingRight: 15,
    borderRadius: 65,
  },

  getOtpButton: {
    width: "100%",
    height: 70,
    borderRadius: 30,
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
});
