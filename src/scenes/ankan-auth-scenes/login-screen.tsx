import React from "react";
import ContentView from "../../layouts/ankan-auth-layouts/login-screen";

export const LoginScreen = ({ navigation, state }): React.ReactElement => {
  const onTabSelect = (index: number): void => {
    navigation.navigate(state.routeNames[index]);
  };

  return <ContentView navigation={navigation} />;
};
