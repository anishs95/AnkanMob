import React from "react";
import { StyleSheet } from "react-native";
import {
  Divider,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import { SafeAreaLayout } from "../../components/safe-area-layout.component";
import { ArrowIosBackIcon } from "../../components/icons";
import ContentView from "../../layouts/ankan-ecommerce-layouts/add-new-address";

export const AddNewAddressScreen = ({ navigation }): React.ReactElement => {
  const renderBackAction = (): React.ReactElement => (
    <TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
  );

  return (
    <SafeAreaLayout style={styles.container} insets="top">
      <TopNavigation
        title="Add/Modify Address"
        accessoryLeft={renderBackAction}
      />
      <Divider />
      <ContentView navigation={navigation} />
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
