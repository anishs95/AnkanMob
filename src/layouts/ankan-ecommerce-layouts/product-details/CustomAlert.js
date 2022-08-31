import React, { useState } from "react";

import { Modal, Text, View, TouchableOpacity, Image } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function CustomAlert({
  displayMode,
  displayMsg,
  visibility,
  dismissAlert,
}) {
  return (
    <View>
      <Modal visible={visibility} animationType={"fade"} transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(52, 52, 52, 0.8)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              alignItems: "center",
              backgroundColor: "white",
              height: 200,
              width: "90%",
              borderWidth: 1,
              borderColor: "#fff",
              borderRadius: 7,
              elevation: 10,
            }}
          >
            <View style={{ alignItems: "center", margin: 10 }}>
              {displayMode == "success" ? (
                <>
                  <Image
                    source={require("./assets/addtocart.gif")}
                    style={{ width: 150, height: 150 }}
                  />
                </>
              ) : (
                <>
                  <MaterialIcons name="cancel" color={"red"} size={80} />
                </>
              )}
              <Text style={{ fontSize: 18, marginTop: -15 }}>{displayMsg}</Text>
            </View>

            {/* <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => dismissAlert(false)}
              style={{
                width: "95%",
                borderRadius: 0,
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                backgroundColor: "blue",
                borderColor: "#ddd",
                borderBottomWidth: 0,
                borderRadius: 5,
                bottom: 0,
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "white", margin: 15 }}>OK</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </Modal>
    </View>
  );
}
