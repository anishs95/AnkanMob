import React, { useEffect } from "react";
import { Image, ListRenderItemInfo, View } from "react-native";
import {
  Button,
  Card,
  Layout,
  List,
  StyleService,
  Text,
  useStyleSheet,
  Radio,
  RadioGroup,
  RadioGroupProps,
} from "@ui-kitten/components";
import { CreditCardIcon, MoreVerticalIcon } from "./extra/icons";
import { PaymentCard, Address } from "./extra/data";
import AsyncStorage from "@react-native-async-storage/async-storage";

const paymentCards: PaymentCard[] = [PaymentCard.emilyClarckVisa()];

export default ({ navigation }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [addressLine1, setAddressLine1] = React.useState<string>();
  const [addressLine2, setAddressLine2] = React.useState<string>();
  const [city, setCity] = React.useState<string>();
  const [district, setDistrict] = React.useState<string>();
  const [zipcode, setZipcode] = React.useState<string>();
  const [state, setState] = React.useState<string>();
  const [isAddress, setIsAddress] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState();
  const [items, setItems] = React.useState([]);
  const [userId, setUserId] = React.useState<string>();
  const [locationId, setLocationId] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [addressDetails, setAddressDetails] = React.useState([]);

  const options: string[] = ["Option 1", "Option 2", "Option 3"];

  const getCartDetails = async (userIds, lcnIds) => {
    console.log("usersid" + userIds);
    fetch(
      "https://api.dev.ankanchem.net/cart/api/Cart/GetCart/" +
        userIds +
        "/" +
        lcnIds
    )
      .then((response) => response.json())
      .then((json) => {
        setItems(json.items);

        console.log("INSIDE THE PAYMENT cart Details");
        console.log(JSON.stringify(json.items));
      })
      .catch((error) => console.error("error44" + error))
      .finally(() => setIsLoading(false));
  };

  const getShippingAddress = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@shippingAddress");
      console.log("Address DETAILS :- " + jsonValue);
      const val = jsonValue != null ? JSON.parse(jsonValue) : null;
      setAddressDetails(val);
      if (val) {
        setIsAddress(true);
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

  const getUserIdAndLocationId = async () => {
    try {
      const usrId = await AsyncStorage.getItem("userId");
      const lcnId = await AsyncStorage.getItem("locationId");
      setUserId(usrId);
      setLocationId(lcnId);
      getCartDetails(JSON.parse(usrId), lcnId);
      console.log(
        "User Id  and lcn id in Payment Screen " +
          JSON.parse(usrId) +
          " loc --> " +
          lcnId
      );
    } catch (e) {
      console.log("error in reading data ");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getShippingAddress();
      getUserIdAndLocationId();

      const shippingAddress = new Address(
        addressLine1,
        addressLine2,
        city,
        district,
        zipcode,
        state
      );
    });
    return unsubscribe;
  }, [navigation]);

  const onBuyButtonPress = (): void => {
    console.log("ON BUY BUTTON FINAL PRESS////////////////////");
    console.log(addressDetails);
    console.log(items);
    console.log(locationId);
    console.log(JSON.parse(userId));

    fetch("https://api.dev.ankanchem.net/purchase/api/Purchase/PlaceOrder", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IlZHb3BpbmF0aCIsIm5iZiI6MTYyMzEzNjY1MSwiZXhwIjoxNjIzMjIzMDUxLCJpYXQiOjE2MjMxMzY2NTF9.fXmdUO49ayKRrc3zSBJbwaMetTOlMcRzoY4AC7U1Zxs",
      },
      body: JSON.stringify({
        UserId: JSON.parse(userId),
        LocationId: locationId,
        Items: items,
        BillingAddress: addressDetails,
        ShippingAddress: addressDetails,
        ShippingCost: 0,
        ModeOfPayment: 0,
        Status: 0,
        Discount: 0,
        CouponCode: "",
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(JSON.stringify(json));
        return json;
      })
      .catch((error) => {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.error("FAILED IN PLACING ORDER error " + error);
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
      });

    navigation && navigation.goBack();
  };

  const onPlaceholderCardPress = (): void => {
    navigation && navigation.navigate("NewAddress");
  };

  const renderFooter = (): React.ReactElement => (
    <Card style={styles.placeholderCard} onPress={onPlaceholderCardPress}>
      <CreditCardIcon {...styles.creditCardIcon} />
      <Text appearance="hint" category="s1">
        Add New Card
      </Text>
    </Card>
  );

  const renderCardItem = (
    info: ListRenderItemInfo<PaymentCard>
  ): React.ReactElement => (
    <View style={styles.cardItem}>
      <View style={styles.cardLogoContainer}>
        <Image style={styles.cardLogo} source={info.item.logo} />
        <Button
          style={styles.cardOptionsButton}
          appearance="ghost"
          status="control"
          accessoryLeft={MoreVerticalIcon}
          onPress={onPlaceholderCardPress}
        />
      </View>
      <Text style={styles.cardNumber} category="h6" status="control">
        {addressLine1}
      </Text>
      <View style={styles.cardNameContainer}>
        <Text style={styles.cardDetailsLabel} category="p2" status="control">
          {addressLine2}
        </Text>
        <Text category="s1" status="control">
          {district}
        </Text>
      </View>
      <View style={styles.cardExpirationContainer}>
        <Text style={styles.cardDetailsLabel} category="p2" status="control">
          {state}
        </Text>
        <Text category="s1" status="control">
          {zipcode}
        </Text>
      </View>
    </View>
  );

  const renderCardItem2 = (
    info: ListRenderItemInfo<PaymentCard>
  ): React.ReactElement => (
    <Layout style={styles.container} level="2">
      {isAddress ? (
        <View style={styles.cardItem}>
          <View style={styles.cardLogoContainer}>
            <Image style={styles.cardLogo} source={info.item.logo} />
            <Button
              style={styles.cardOptionsButton}
              appearance="ghost"
              status="control"
              accessoryLeft={MoreVerticalIcon}
              onPress={onPlaceholderCardPress}
            />
          </View>
          <Text style={styles.cardNumber} category="h6" status="control">
            {addressLine1}
          </Text>
          <View style={styles.cardNameContainer}>
            <Text
              style={styles.cardDetailsLabel}
              category="p2"
              status="control"
            >
              {addressLine2}
            </Text>
            <Text category="s1" status="control">
              {district}
            </Text>
          </View>
          <View style={styles.cardExpirationContainer}>
            <Text
              style={styles.cardDetailsLabel}
              category="p2"
              status="control"
            >
              {state}
            </Text>
            <Text category="s1" status="control">
              {zipcode}
            </Text>
          </View>
        </View>
      ) : (
        <Card style={styles.placeholderCard} onPress={onPlaceholderCardPress}>
          <CreditCardIcon {...styles.creditCardIcon} />
          <Text appearance="hint" category="s1">
            Add New Address
          </Text>
        </Card>
      )}
    </Layout>
  );

  return (
    <React.Fragment>
      <List
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={paymentCards}
        renderItem={renderCardItem2}
        // ListFooterComponent={renderFooter}
      />
      <RadioGroup selectedIndex={selectedIndex}>
        {options.map((el, index) => (
          <Radio key={index}>
            {(evaProps) => <Text {...evaProps}>{el}</Text>}
          </Radio>
        ))}
      </RadioGroup>
      <Layout style={styles.buyButtonContainer}>
        <Button size="giant" onPress={onBuyButtonPress}>
          BUY
        </Button>
      </Layout>
    </React.Fragment>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  cardItem: {
    margin: 8,
    height: 242,
    padding: 24,
    borderRadius: 4,
    backgroundColor: "color-primary-default",
  },
  cardLogoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLogo: {
    height: 74,
    width: 75,
    tintColor: "text-control-color",
  },
  cardOptionsButton: {
    position: "absolute",
    right: -16,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  cardNumber: {
    marginVertical: 24,
  },
  cardDetailsLabel: {
    marginVertical: 4,
  },
  cardNameContainer: {
    position: "absolute",
    left: 24,
    bottom: 24,
  },
  cardExpirationContainer: {
    position: "absolute",
    right: 24,
    bottom: 24,
  },
  placeholderCard: {
    justifyContent: "center",
    alignItems: "center",
    height: 162,
    margin: 8,
    backgroundColor: "background-basic-color-3",
  },
  creditCardIcon: {
    alignSelf: "center",
    width: 48,
    height: 48,
    // tintColor: 'text-hint-color',
  },
  buyButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
});
