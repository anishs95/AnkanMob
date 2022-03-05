import React from "react";
import { StyleSheet } from "react-native";
import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import {
  ArrowIosBackIcon,
  BookmarkIcon,
  ShopingCartIcon,
} from "../../components/icons";
import ContentView from "../../layouts/ankan-ecommerce-layouts/product-details";

export const ProductDetailsScreen = ({ navigation }): React.ReactElement => {
  const [bookmarked, setBookmarked] = React.useState<boolean>(false);

  const onBookmarkActionPress = (): void => {
    setBookmarked(!bookmarked);
    navigation && navigation.navigate("ShoppingCart");
  };

  const renderBackAction = (): React.ReactElement => (
    <TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
  );

  const renderBookmarkAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={bookmarked ? ShopingCartIcon : ShopingCartIcon}
      onPress={onBookmarkActionPress}
    />
  );

  return (
    <SafeAreaLayout style={styles.container} insets="top">
      <TopNavigation
        title="Product Details"
        accessoryLeft={renderBackAction}
        accessoryRight={renderBookmarkAction}
      />
      <ContentView navigation={navigation} />
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
