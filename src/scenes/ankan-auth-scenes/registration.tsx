import React from "react";
import ContentView from "../../layouts/ankan-auth-layouts/registration";

export const RegistarationScreen = ({
  navigation,
  state,
}): React.ReactElement => {
  const onTabSelect = (index: number): void => {
    navigation.navigate(state.routeNames[index]);
  };

  return <ContentView navigation={navigation} />;
};
