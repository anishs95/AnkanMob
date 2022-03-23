import React, { useEffect } from "react";
import { View } from "react-native";
import {
  Button,
  Datepicker,
  Divider,
  Icon,
  Input,
  Layout,
  StyleService,
  useStyleSheet,
} from "@ui-kitten/components";
import { KeyboardAvoidingView } from "./extra/3rd-party";
import { Address } from "./extra/data";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default ({ navigation }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);

  const [addressLine1, setAddressLine1] = React.useState<string>();
  const [addressLine2, setAddressLine2] = React.useState<string>();
  const [city, setCity] = React.useState<string>();
  const [district, setDistrict] = React.useState<string>();
  const [zipcode, setZipcode] = React.useState<string>();
  const [state, setState] = React.useState<string>();

  const [initAddress, setinitAddress] = React.useState<boolean>(false);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@shippingAddress");
      console.log("Address DETAILS :- " + jsonValue);
      const val = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (val) {
        setAddressLine1(val.addressLine1);
        setAddressLine2(val.addressLine2);
        setDistrict(val.district);
        setZipcode(val.zipcode);
        setCity(val.city);
        setState(val.state);
      } else {
        setAddressLine1("");
        setAddressLine2("");
        setDistrict("");
        setZipcode("");
        setCity("");
        setState("");
      }
    } catch (e) {
      console.log("error in reading data ");
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const onAddButtonPress = (): void => {
    const storeData = async (value) => {
      try {
        const jsonValue = JSON.stringify(value);
        console.log("shippingAddress: " + jsonValue);
        await AsyncStorage.setItem("@shippingAddress", jsonValue);
        console.log("sucess in storing values of product details");
        navigation && navigation.goBack();
      } catch (e) {
        // saving error
        console.log("failed in storing values of Shipping details" + e);
      }
    };

    const shippingAddress = new Address(
      addressLine1,
      addressLine2,
      city,
      district,
      zipcode,
      state
    );

    storeData(shippingAddress);

    console.log(shippingAddress);
  };
  const onOTPentered = (datas): void => {
    console.log(datas);
  };
  return (
    <KeyboardAvoidingView style={styles.container}>
      <Layout style={styles.form} level="1">
        <Input
          style={styles.input}
          label="Address Line 1"
          placeholder={addressLine1}
          maxLength={30}
          value={addressLine1}
          onChangeText={setAddressLine1}
        />
        <Input
          style={styles.input}
          label="Address Line 2"
          placeholder={addressLine2}
          maxLength={30}
          value={addressLine2}
          onChangeText={setAddressLine2}
        />
        <Input
          style={styles.input}
          label="City"
          placeholder={city}
          maxLength={30}
          value={city}
          onChangeText={setCity}
        />
        <View style={styles.middleContainer}>
          <Input
            style={[styles.input, styles.middleInput1]}
            label="District"
            placeholder={district}
            maxLength={30}
            value={district}
            onChangeText={setDistrict}
          />

          <Input
            style={[styles.input, styles.middleInput]}
            label="PinCode"
            placeholder={zipcode}
            maxLength={30}
            keyboardType="numeric"
            value={zipcode}
            onChangeText={setZipcode}
          />
        </View>
        <Input
          style={styles.input}
          label="State"
          placeholder={state}
          maxLength={30}
          value={state}
          onChangeText={setState}
        />
      </Layout>
      <Divider />
      <Button style={styles.addButton} size="giant" onPress={onAddButtonPress}>
        ADD ADDRESS
      </Button>
    </KeyboardAvoidingView>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: "background-basic-color-2",
  },
  form: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 24,
  },
  input: {
    marginHorizontal: 12,
    marginVertical: 8,
  },
  middleContainer: {
    flexDirection: "row",
  },
  middleInput: {
    width: "30%",
  },
  middleInput1: {
    width: "50%",
  },
  addButton: {
    marginHorizontal: 16,
    marginVertical: 24,
  },
});
