import React, { useState, useEffect, useRef, Component } from "react";
import {
  ListRenderItemInfo,
  View,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  BackHandler,
  Alert,
} from "react-native";
import CustomAlert from "./CustomAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import {
  Button,
  Layout,
  List,
  StyleService,
  Text,
  useStyleSheet,
} from "@ui-kitten/components";
import {
  ArrowIosBackIcon,
  BookmarkIcon,
  BookmarkOutlineIcon,
} from "../../../components/icons";
import ModalDropdown from "react-native-modal-dropdown";
import { CartItem } from "./extra/cart-item.component";
import { Product } from "./extra/data2";
import Dialog from "react-native-dialog";

const initialProducts: Product[] = [];

export default ({ navigation }): React.ReactElement => {
  const [cartList, setCartList] = useState([]);
  const [cartId, setCartId] = useState();
  var [cartNameSelected, setCartNameSelected] = React.useState<string>();
  const [isLoading2, setIsLoading2] = React.useState<boolean>(false);
  const [userId, setUserId] = React.useState<string>();
  const [isCartEmpty, setCartEmpty] = React.useState<boolean>(true);
  const [cartSize, setCartSize] = React.useState<number>();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productss, setProducts] = useState<Product[]>([]);
  const [isDefaultCart, setDefaultCart] = React.useState<boolean>(false);
  var [data, setData] = useState();
  const [cartName, setCartName] = React.useState<string>();
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [sharePhoneNumber, setSharePhoneNumber] = React.useState<string>();
  const [cusLocationId, setCusLocationId] = React.useState<string>();
  const [showDonationSuccessPopup, setShowDonationSuccessPopup] =
    useState(false);
  const [showDonationSuccessPopup2, setShowDonationSuccessPopup2] =
    useState(false);
  const [showDonationErrPopup, setShowDonationErrPopup] = React.useState(false);

  const showDialog = () => {
    setVisible(true);
  };
  const showDialog2 = () => {
    setVisible2(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setVisible2(false);
  };

  const handleSave = () => {
    setIsLoading2(true);
    console.log(cartName);
    fetch(
      "https://api.ankanchem.net/cart/api/Cart/SaveCart/" +
        userId +
        "/" +
        cartName,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IlZHb3BpbmF0aCIsIm5iZiI6MTYyMzEzNjY1MSwiZXhwIjoxNjIzMjIzMDUxLCJpYXQiOjE2MjMxMzY2NTF9.fXmdUO49ayKRrc3zSBJbwaMetTOlMcRzoY4AC7U1Zxs",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        console.log("[CART NAME SAVED]" + json);

        setIsLoading2(false);
        setShowDonationSuccessPopup(true);
        setTimeout(() => {
          setShowDonationSuccessPopup(false);
          navigation && navigation.navigate("ProductDetails");
        }, 2000);
        // alert("SUCCESS");

        return json;
      })
      .catch((error) => {
        alert("Something went wrong Try Again");
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.error("Save  Cart Name error " + error);
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
      });
    setIsLoading2(false);
    setVisible(false);
  };

  const handleShare = () => {
    console.log("Share cart :" + sharePhoneNumber);
    console.log("Share cart :" + cartId);
    fetch(
      "https://api.ankanchem.net/cart/api/Cart/SendYourCart/" +
        userId +
        "/" +
        cartId +
        "/" +
        sharePhoneNumber,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IlZHb3BpbmF0aCIsIm5iZiI6MTYyMzEzNjY1MSwiZXhwIjoxNjIzMjIzMDUxLCJpYXQiOjE2MjMxMzY2NTF9.fXmdUO49ayKRrc3zSBJbwaMetTOlMcRzoY4AC7U1Zxs",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        console.log("[CART NAME SAVED]" + json);
        setShowDonationSuccessPopup2(true);
        setTimeout(() => {
          setShowDonationSuccessPopup2(false);
          navigation && navigation.navigate("ProductDetails");
        }, 2000);
        return json;
      })
      .catch((error) => {
        alert("Something went wrong Try Again");
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.error("Save  Cart Name error " + error);
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
      });

    setVisible2(false);
  };

  useEffect(() => {
    AsyncStorage.getItem("userId", (err, res) => {
      if (!res) {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("USER ID is Not found");
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
      } else {
        console.log("USER ID " + res);
        getCartItems(res, null);
        setUserId(res);
        fetch("https://api.ankanchem.net/cart/api/Cart/GetUserCartList/" + res)
          .then((response) => response.json())
          .then((json) => {
            setCartList(json);
            // console.log(json[0].cartName);
          })
          .catch((error) => console.error(error));
      }
    });
  }, []);

  const getCartUrl = async (usrIds, cartId) => {
    const lcnId = await AsyncStorage.getItem("locationId");
    // alert(lcnId);
    setCusLocationId(lcnId);
    var URL;
    if (cartId == null) {
      URL =
        "https://api.ankanchem.net/cart/api/Cart/GetCart/" +
        usrIds +
        "/" +
        lcnId;
      setDefaultCart(true);
    } else {
      URL =
        "https://api.ankanchem.net/cart/api/Cart/GetCart/" +
        userId +
        "/" +
        cartId +
        "/" +
        lcnId;
    }
    return URL;
  };

  const getCartItems = async (usrIds, cartId) => {
    //alert(URL);
    setIsLoading2(true);
    const URLs = await getCartUrl(usrIds, cartId);
    //  alert(URLs);
    fetch(URLs)
      .then((response) => response.json())
      .then((json) => {
        console.log("Lengthss123");
        //alert(json.items);
        if (json.items == null || json.items == "") {
          //  alert("Empty Cart");
          setCartSize(0);
          setCartEmpty(true);
          setItems([]);
          setCartItemsFunction([]);
        } else {
          //   alert(json.items.length);
          setCartSize(json.items.length);
          if (json.items.length > 0) {
            setCartEmpty(false);
            setItems(json.items);
            setCartItemsFunction(json.items);
            console.log(json.items);
          }
        }
        setData(json);
      })
      .catch((error) => console.error("err 12312 :" + error))
      .finally(() => {
        setIsLoading2(false);
        setIsLoading(false);
      });
  };

  const setCartItemsFunction = async (items) => {
    console.log("ITEMS" + JSON.stringify(items));
    var ret = items.map(myFunction);
    function myFunction(value, index, array) {
      //   alert(JSON.stringify(value.color));
      let col = value.color;
      if (value.color != undefined) {
        col = value.color.name;
      }
      var prod: Product = new Product(
        value.productId,
        value.categoryId,
        value.productName,
        value.description,
        value.unitPrice,
        value.quantity,
        value.unit,
        col,
        value.imageUrl,
        value.color
      );
      return prod;
    }
    setProducts(ret);
    console.log("return " + productss);
  };

  const onItemChange = (product: Product, index: number): void => {
    // alert(JSON.stringify(product));
    productss[index] = product;
    setProducts([...productss]);
  };

  const onItemRemove = (product: Product, index: number): void => {
    setCartSize(cartSize - 1);
    // alert(cartSize);
    if (cartSize <= 1) {
      setCartEmpty(true);
    }
    productss.splice(index, 1);
    setProducts([...productss]);
    console.log("USR ID 3 " + userId);
    console.log("Cart ID 3 " + cartId);
    console.log("cusLocationId ID 3 " + cusLocationId);
    console.log("Product ID 3 " + JSON.stringify(product));
    var URL;

    if (cartId == null || typeof cartId == "undefined") {
      URL =
        "https://api.ankanchem.net/cart/api/Cart/RemoveItemFromCart/" +
        userId +
        "/" +
        cusLocationId;
    } else {
      URL =
        "https://api.ankanchem.net/cart/api/Cart/RemoveItemFromCart/" +
        userId +
        "/" +
        cartId +
        "/" +
        cusLocationId;
    }
    // alert(URL);
    fetch(URL, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IlZHb3BpbmF0aCIsIm5iZiI6MTYyMzEzNjY1MSwiZXhwIjoxNjIzMjIzMDUxLCJpYXQiOjE2MjMxMzY2NTF9.fXmdUO49ayKRrc3zSBJbwaMetTOlMcRzoY4AC7U1Zxs",
      },
      body: JSON.stringify({
        ProductId: product.id,
        ProductName: product.name,
        Quantity: product.quantity,
        Color: product.colorsObject,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        console.log("[CART DETAIL remove-product response]" + json);
        navigation && navigation.navigate("ShoppingCart");
        return json;
      })
      .catch((error) => {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.error("Add Cart error " + error);
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
      });
    console.log(product);
  };

  const renderProductItem = (
    info: ListRenderItemInfo<Product>
  ): React.ReactElement => (
    <CartItem
      style={styles.item}
      index={info.index}
      product={info.item}
      cartId={cartId}
      onProductChange={onItemChange}
      onRemove={onItemRemove}
    />
  );

  const totalCost = (): number => {
    console.log("Item from parent about product in cart is .... " + productss);
    return productss.reduce(
      (acc: number, product: Product): number => acc + product.totalPrice,
      0
    );
  };

  const renderFooter = (): React.ReactElement => (
    <Layout style={styles.footer}>
      <Text category="h5">Total Cost:</Text>
      {/* <Text category="h5">{data.totalAmount}</Text> */}
      <Text category="h5">{`₹${totalCost()}`}</Text>
    </Layout>
  );

  const onCheckoutButtonPress = (): void => {
    navigation &&
      navigation.navigate("Payment", { cartNameSelecteds: cartNameSelected });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Layout style={styles.container} level="2">
          {/* <ModalDropdown
            options={cartList.map((value, index) => {
              return value.cartName;
            })}
            defaultValue="Default Cart ▼"
            //  dropdownTextStyle={styles.dropdown_3_dropdownTextStyle}
            style={styles.dropdown_5}
            renderRightComponent={BookmarkIcon}
            isFullWidth
            textStyle={styles.dropdown_2_text}
            onSelect={(index3, value3) => {
              setCartId(cartList[index3].cartId);
              setCartNameSelected(cartList[index3].cartId);
              if (value3 === "Default") {
                setDefaultCart(true);
              } else {
                setDefaultCart(false);
              }
              getCartItems(null, cartList[index3].cartId);
            }}
          /> */}
          {/* <Text>{place}</Text> */}
          {isLoading ? (
            <ActivityIndicator size="large" color="red" />
          ) : (
            <View>
              <List
                data={productss}
                renderItem={renderProductItem}
                ListFooterComponent={renderFooter}
              />
              {/* {isDefaultCart ? (
                <Button
                  style={styles.checkoutButton}
                  size="medium"
                  disabled={isCartEmpty}
                  onPress={showDialog}
                >
                  SAVE CART
                </Button>
              ) : (
                <Button
                  style={styles.checkoutButton}
                  size="medium"
                  disabled={isCartEmpty}
                  onPress={showDialog2}
                >
                  SHARE CART
                </Button>
              )} */}

              <Dialog.Container visible={visible} statusBarTranslucent>
                <Dialog.Title>Provide Cart Name</Dialog.Title>
                {/* <Dialog.Description>
                  Do you want to delete this account? You cannot undo this
                  action.
                </Dialog.Description> */}
                <Dialog.Input onChangeText={setCartName}></Dialog.Input>
                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Button label="Save" onPress={handleSave} />
              </Dialog.Container>

              <Dialog.Container visible={visible2} statusBarTranslucent>
                <Dialog.Title>Share Cart</Dialog.Title>
                <Dialog.Description>
                  Enter the Phone Number to which you need to share the cart.
                </Dialog.Description>
                <Dialog.Input
                  onChangeText={setSharePhoneNumber}
                  keyboardType="numeric"
                  textAlign="center"
                  maxLength={10}
                ></Dialog.Input>
                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Button label="Save" onPress={handleShare} />
              </Dialog.Container>
            </View>
          )}
        </Layout>
        <Spinner
          overlayColor="rgba(0, 0, 0, 0.6)"
          size="large"
          visible={isLoading2}
          textContent={"Processing..."}
          textStyle={styles.spinnerTextStyle}
        />
      </ScrollView>
      <CustomAlert
        displayMode={"success"}
        displayMsg={"Cart Name Saved"}
        visibility={showDonationSuccessPopup}
        dismissAlert={setShowDonationSuccessPopup}
      />
      <CustomAlert
        displayMode={"success"}
        displayMsg={"Cart Shared Success"}
        visibility={showDonationSuccessPopup2}
        dismissAlert={setShowDonationSuccessPopup2}
      />
      <Button
        style={styles.checkoutButton}
        size="giant"
        disabled={isCartEmpty}
        onPress={onCheckoutButtonPress}
      >
        CHECKOUT
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleService.create({
  container: {
    flex: 1,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "background-basic-color-3",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 0.5,
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  checkoutButton: {
    marginHorizontal: 16,
    marginVertical: 24,
  },
  dropdown_3_dropdownTextStyle: {
    marginHorizontal: 16,
    fontSize: 12,
  },
  dropdown_2_text: {
    fontSize: 18,
    color: "#120",
    textAlign: "center",
    alignSelf: "flex-end",
    textAlignVertical: "center",
  },
  dropdown_5: {
    alignSelf: "flex-end",
    margin: 8,
    borderColor: "black",
    height: 40,
    width: "50%",
    backgroundColor: "#A9A9A9	",
    borderWidth: 0.5,
    borderRadius: 5,
    padding: 8,
    paddingLeft: 20,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});
