import React from "react";
import { StyleSheet, Image, Alert, BackHandler } from "react-native";
import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import { ArrowIosBackIcon, ShopingCartIcon } from "../../components/icons";
import ContentView from "../../layouts/ankan-ecommerce-layouts/category-list";
import { MenuIcon } from "../../components/icons";

export const CategoryListScreen = ({ navigation }): React.ReactElement => {
  const [bookmarked, setBookmarked] = React.useState<boolean>(false);

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
  const onBookmarkActionPress = (): void => {
    setBookmarked(!bookmarked);
    navigation && navigation.navigate("ShoppingCart");
  };

  const renderBookmarkAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={bookmarked ? ShopingCartIcon : ShopingCartIcon}
      onPress={onBookmarkActionPress}
    />
  );

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction icon={MenuIcon} onPress={navigation.toggleDrawer} />
  );

  return (
    <SafeAreaLayout style={styles.container} insets="top">
      <TopNavigation
        title="Ankan Store"
        accessoryLeft={renderDrawerAction}
        accessoryRight={renderBookmarkAction}
      />
      <ContentView />
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
