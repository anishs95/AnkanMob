import React, { useEffect } from "react";
import { Image, ListRenderItemInfo, View, CheckBox } from "react-native";
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
import Spinner from "react-native-loading-spinner-overlay";
import CustomAlert from "./CustomAlert";
const paymentCards: PaymentCard[] = [PaymentCard.emilyClarckVisa()];

export default ({ navigation, route }): React.ReactElement => {
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
  const [isLoading, setIsLoading] = React.useState(false);
  const [cartNameSelected, setCartNameSelected] = React.useState<string>();
  const [place, setPlace] = React.useState<string>();
  const [userName, setUserName] = React.useState<string>();

  const [addressDetails, setAddressDetails] = React.useState([]);
  const [showDonationSuccessPopup, setShowDonationSuccessPopup] =
    React.useState(false);
  const getCartDetails = async (userIds, lcnIds, cartId) => {
    var URL;
    // alert("GET CART :" + cartId);
    if (cartId == null || cartId == "") {
      URL =
        "https://api.dev.ankanchem.net/cart/api/Cart/GetCart/" +
        userIds +
        "/" +
        "<location>";
    } else {
      URL =
        "https://api.dev.ankanchem.net/cart/api/Cart/GetCart/" +
        userIds +
        "/" +
        cartId +
        "/<location>";
    }
    console.log("usersid" + userIds);
    console.log("URL here" + URL);
    fetch(URL)
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

  const clearCart = async () => {
    console.log("Cart clearing Success " + userId);
    console.log(
      "URL cart clearing :" +
        "https://api.dev.ankanchem.net/cart/api/Cart/ClearCart/" +
        userId +
        "/" +
        cartNameSelected
    );
    try {
      fetch(
        "https://api.dev.ankanchem.net/cart/api/Cart/ClearCart/" +
          userId +
          "/" +
          cartNameSelected,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IlZHb3BpbmF0aCIsIm5iZiI6MTYyMzEzNjY1MSwiZXhwIjoxNjIzMjIzMDUxLCJpYXQiOjE2MjMxMzY2NTF9.fXmdUO49ayKRrc3zSBJbwaMetTOlMcRzoY4AC7U1Zxs",
          },
          body: JSON.stringify({}),
        }
      )
        .then((response) => response.json())
        .then((json) => {
          console.log("Cart clearing Success ");
          setShowDonationSuccessPopup(true);
          setTimeout(() => {
            setShowDonationSuccessPopup(false);

            const storeData = async () => {
              try {
                await AsyncStorage.removeItem("@shippingAddress");
                console.log("Address removed");
              } catch (exception) {
                console.log(exception);
              }
            };
            storeData();
            navigation && navigation.navigate("Category");
          }, 2000);
          // alert("Successfully Placed Order");
          // alert("Successfully Placed Order");
          //navigation && navigation.navigate("Category");
          return json;
        })
        .catch((error) => {
          console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
          console.error("Cart clearing error " + error);
          console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
        })
        .finally(() => setIsLoading(false));
    } catch (e) {
      console.log("error in clearing cart ");
    }
  };

  const getUserIdAndLocationId = async (cartId) => {
    try {
      const usrId = await AsyncStorage.getItem("userId");
      const lcnId = await AsyncStorage.getItem("locationId");
      const username = await AsyncStorage.getItem("userName");
      const place = await AsyncStorage.getItem("place");
      setUserId(usrId);
      setLocationId(lcnId);
      getCartDetails(usrId, lcnId, cartId);
      setUserName(username);
      setPlace(place);
      console.log(
        "User Id  and lcn id in Payment Screen " + usrId + " loc --> " + lcnId
      );
    } catch (e) {
      console.log("error in reading data ");
    }
  };

  useEffect(() => {
    var cartId;
    if (typeof route.params.cartNameSelecteds != "undefined") {
      // alert("fdsf:" + route.params.cartNameSelecteds);
      setCartNameSelected(route.params.cartNameSelecteds);
      cartId = route.params.cartNameSelecteds;
    } else {
      // alert("route.params.cartNameSelecteds");
      setCartNameSelected("");
      cartId = "";
    }

    console.log(
      "Payment details route param cart name :" + route.params.cartNameSelecteds
    );
    const unsubscribe = navigation.addListener("focus", () => {
      getShippingAddress();
      getUserIdAndLocationId(cartId);

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
    setIsLoading(true);
    console.log("ON BUY BUTTON FINAL PRESS////////////////////");
    console.log(addressDetails);
    console.log(items);
    console.log(locationId);
    console.log(userId);

    fetch("https://api.dev.ankanchem.net/purchase/api/Purchase/PlaceOrder", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IlZHb3BpbmF0aCIsIm5iZiI6MTYyMzEzNjY1MSwiZXhwIjoxNjIzMjIzMDUxLCJpYXQiOjE2MjMxMzY2NTF9.fXmdUO49ayKRrc3zSBJbwaMetTOlMcRzoY4AC7U1Zxs",
      },
      body: JSON.stringify({
        UserId: userId,
        LocationId: locationId,
        UserName: userName,
        LocationName: place,
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
        console.log("REPLAY FROM PURCHASE");
        console.log(JSON.stringify(json));
        getUserIdAndLocationId();
        clearCart();
        return json;
      })
      .catch((error) => {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.error("FAILED IN PLACING ORDER error " + error);
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
        setIsLoading(false);
      });
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
            <Button
              style={styles.cardOptionsButton}
              appearance="ghost"
              status="control"
              accessoryLeft={MoreVerticalIcon}
              onPress={onPlaceholderCardPress}
            />
            <Text
              style={styles.cardOptionsButton2}
              category="label"
              status="control"
            >
              COD
            </Text>
          </View>
          <Text
            style={{
              fontWeight: "bold",
              fontStyle: "italic",
              textDecorationLine: "underline",
            }}
            category="h6"
            status="control"
          >
            Delivery Address
          </Text>
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
        <Button size="giant" onPress={onPlaceholderCardPress} status="warning">
          Add Address
        </Button>
      )}
    </Layout>
  );

  return (
    <React.Fragment>
      <List
        contentContainerStyle={styles.listContent}
        data={paymentCards}
        renderItem={renderCardItem2}
        // ListFooterComponent={renderFooter}
      />

      <Spinner
        overlayColor="rgba(0, 0, 0, 0.6)"
        size="large"
        visible={isLoading}
        textContent={"Placing Order..."}
        textStyle={styles.spinnerTextStyle}
      />
      <CustomAlert
        displayMode={"success"}
        displayMsg={"Successfully Placed Order"}
        visibility={showDonationSuccessPopup}
        dismissAlert={setShowDonationSuccessPopup}
      />
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
    flex: 0.5,
  },

  listContent: {
    padding: 16,
  },
  cardItem: {
    margin: 8,
    height: 220,
    padding: 24,
    borderRadius: 4,
    backgroundColor: "#008B8B",
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
  cardOptionsButton2: {
    position: "absolute",
    right: 1,
    top: 55,
    color: "black",
    fontWeight: "bold",
    backgroundColor: "#FFD700",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  cardNumber: {
    marginTop: 20,
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
    height: 70,
    margin: 8,
    backgroundColor: "blue",
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
    paddingHorizontal: 26,
    paddingVertical: 24,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
});
