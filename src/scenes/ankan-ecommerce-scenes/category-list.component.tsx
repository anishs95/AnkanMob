import React from "react";
import { StyleSheet, Image, Alert, BackHandler } from "react-native";
import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import { ArrowIosBackIcon } from "../../components/icons";
import ContentView from "../../layouts/ankan-ecommerce-layouts/category-list";
import { MenuIcon } from "../../components/icons";

export const CategoryListScreen = ({ navigation }): React.ReactElement => {
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

  const renderProfileAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={renderProfileImage}
      onPress={onProfileActionPress}
    />
  );
  const onProfileActionPress = (): void => {
    navigation.navigate("Profile1");
  };
  const renderProfileImage = (): React.ReactElement => (
    <Image
      style={styles.profileImage}
      source={{
        uri: "https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659651_960_720.png",
      }}
    />
  );

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction icon={MenuIcon} onPress={navigation.toggleDrawer} />
  );

  const renderBackAction = (): React.ReactElement => (
    <TopNavigation
      accessoryRight={renderProfileAction}
      accessoryLeft={renderDrawerAction}
    />
  );

  return (
    <SafeAreaLayout style={styles.container} insets="top">
      <TopNavigation title="Ankan Store" accessoryLeft={renderBackAction} />
      <ContentView />
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
