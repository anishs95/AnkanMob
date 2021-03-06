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

  useEffect(() => {
    AsyncStorage.getItem("id", (err, res) => {
      if (!res) {
        console.warn("id is empty");
      } else {
        setId(JSON.parse(res));
        console.info("activation id fetched " + res);
      }
    });
    AsyncStorage.getItem("userName", (err, res) => {
      if (!res) {
        console.warn("user id is empty");
      } else {
        setUserName(JSON.parse(res));
        console.info("user id fetched " + res);
      }
    });
    AsyncStorage.getItem("activationId", (err, res) => {
      if (!res) {
        console.warn("activation id is empty");
      } else {
        setActivationId(JSON.parse(res));
        console.info("activation id fetched " + res);
      }
    });
    AsyncStorage.getItem("activationSecret", (err, res) => {
      if (!res) {
        console.warn("userName id is empty");
      } else {
        setActivationSecret(JSON.parse(res));
        console.info("user id fetched " + res);
      }
    });
  }, []);

  var ShowAlertWithDelay = () => {
    setTimeout(function () {
      console.log(
        "Fetching Bearer token with " +
          id +
          " " +
          userName +
          " " +
          activationId +
          " " +
          activationSecret
      );

      fetch(" https://admin.dev.ankanchem.net/auth/api/Authentication", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IlZHb3BpbmF0aCIsIm5iZiI6MTYyMzEzNjY1MSwiZXhwIjoxNjIzMjIzMDUxLCJpYXQiOjE2MjMxMzY2NTF9.fXmdUO49ayKRrc3zSBJbwaMetTOlMcRzoY4AC7U1Zxs",
        },
        body: JSON.stringify({
          id: id,
          userName: userName,
          activationId: activationId,
          activationSecret: activationSecret,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          setIsPhoneVarified = json.isActive;
          console.log("Authentication Tocken " + JSON.stringify(json));
          AsyncStorage.setItem("bearerTocken", JSON.stringify(json.token));
          return json;
        })
        .catch((error) => {
          console.info("error in authentication tocken api " + error);
        });
    }, 3000);

    console.log("Got Access Key");
  };

  ShowAlertWithDelay();

  const styles = useStyleSheet(themedStyles);

  const onGrantAccess = (): void => {
    AsyncStorage.getItem("bearerTocken", (err, res) => {
      if (!res) {
        console.log("bearerTocken id is empty");
      } else {
        console.log("bearerTocken fetched " + res);
      }
    });
    if (!isPhoneVarified) {
      navigation && navigation.navigate("Home");
    } else {
      alert("Contact Ankan Service Center");
    }
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
              onPress={onGrantAccess}
            >
              GET STARTED
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
    borderRadius: 65,
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
