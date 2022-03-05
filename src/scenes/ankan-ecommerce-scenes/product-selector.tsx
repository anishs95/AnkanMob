import React from "react";
import { StyleSheet } from "react-native";
import { TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import { ArrowIosBackIcon } from "../../components/icons";
import ContentView from "../../layouts/ankan-ecommerce-layouts/product-selector";

export const ProductSelector = ({ navigation }): React.ReactElement => {
  return (
    <SafeAreaLayout style={styles.container} insets="top">
      <ContentView navigation={navigation} />
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
