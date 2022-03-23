import React from "react";
import ContentView from "../../layouts/ankan-auth-layouts/admin-approval";
import { StyleSheet, Image, Alert, BackHandler } from "react-native";

export const AdminApproval = ({ navigation, state }): React.ReactElement => {
  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        const action = e.data.action;
        // if (!hasUnsavedChanges) {
        //   return;
        // }

        e.preventDefault();

        Alert.alert("Exit from Ankan App?", "Click Exit to exit from App", [
          { text: "Continue", style: "cancel", onPress: () => {} },
          {
            text: "Exit",
            style: "destructive",
            //  onPress: () => navigation.dispatch(action),
            // onPress: () => navigation.dispatch(action),
            onPress: () => BackHandler.exitApp(),
            // onPress: () =>
            //   navigation.reset({
            //     index: 0,
            //     routes: [{ name: "Home" }],
            //   }),
          },
        ]);
      }),
    [navigation]
  );

  const onTabSelect = (index: number): void => {
    navigation.navigate(state.routeNames[index]);
  };

  return <ContentView navigation={navigation} />;
};
