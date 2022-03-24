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
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  Layout,
  List,
  StyleService,
  Text,
  useStyleSheet,
} from "@ui-kitten/components";
import { CartItem } from "./extra/cart-item.component";
import { Product } from "./extra/data2";

const initialProducts: Product[] = [];

export default ({ navigation }): React.ReactElement => {
  const styles = useStyleSheet(themedStyle);
  const [cartProducts, setCartProducts] = useState<Product[]>();
  var [data, setData] = useState();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartData, setCartData] = useState([]);
  const [productss, setProducts] = useState<Product[]>([]);
  const [usrID, setUsrID] = useState<string>();

  const componentMounted = useRef(true);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@cartDetails");
      const val = jsonValue != null ? JSON.parse(jsonValue) : null;
      console.log("[CART PAGE]" + val);
      //setData(val);
      // console.log(
      //   "Item from parent about product in cart is .........." +
      //     JSON.stringify(val[3])
      // );
    } catch (e) {
      console.log("error in reading data in cart ");
      setIsLoading(true);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("Refreshed!");
    });
    unsubscribe;
    AsyncStorage.getItem("userId", (err, res) => {
      if (!res) {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("USER ID is Not found");
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
      } else {
        console.log("USER ID is" + res);
        setUsrID(res);
        getCartDetails(res);
      }
    });

    const getCartDetails = async (userId) => {
      fetch(
        "https://api.dev.ankanchem.net/cart/api/Cart/GetCart/" +
          userId +
          "/<location>"
      )
        .then((response) => response.json())
        .then((json) => {
          console.log("Lengthss123");

          if (json.items == null) {
            // alert("Sas");
            setItems([]);
          } else {
            setItems(json.items);
          }

          setData(json);
        })
        .catch((error) => console.error("error" + error))
        .finally(() => setIsLoading(false));
    };

    if (componentMounted.current) {
      // (5) is component still mounted?
    }
    setTimeout(function () {
      console.log("----------------8-----------------");
      console.log("1111111111111111123");
      // console.log(data);
      console.log(data);
      console.log("ITEMS" + items);
      var ret = items.map(myFunction);
      function myFunction(value, index, array) {
        console.log(value.productId);
        var prod: Product = new Product(
          value.productId,
          value.categoryId,
          value.productName,
          value.description,
          value.unitPrice,
          value.quantity,
          value.unit,
          value.colors,
          value.imageUrl
        );
        return prod;
      }
      setProducts(ret);
      console.log("return " + productss);
    }, 1000); //run this after 3 seconds

    const backAction = () => {
      navigation.goBack();
      // Alert.alert(JSON.stringify(data));
      // Alert.alert("Hold on!", "Are you sure you want to go back?", [
      //   {
      //     text: "Cancel",
      //     onPress: () => null,
      //     style: "cancel",
      //   },
      //   { text: "YES", onPress: () => BackHandler.exitApp() },
      // ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => {
      // This code runs when component is unmounted
      componentMounted.current = false; // (4) set it to false when we leave the page
    };
  }, data);

  const totalCost = (): number => {
    console.log("Item from parent about product in cart is .... " + productss);
    return productss.reduce(
      (acc: number, product: Product): number => acc + product.totalPrice,
      0
    );
  };

  const onItemRemove = (product: Product, index: number): void => {
    productss.splice(index, 1);
    setProducts([...productss]);
    console.log("USR ID " + usrID);
    fetch(
      "https://api.dev.ankanchem.net/cart/api/Cart/RemoveItemFromCart/" +
        usrID +
        "/" +
        "location",
      {
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
        }),
      }
    )
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

  const onItemChange = (product: Product, index: number): void => {
    // alert(JSON.stringify(product));
    productss[index] = product;
    setProducts([...productss]);
  };

  const renderFooter = (): React.ReactElement => (
    <Layout style={styles.footer}>
      <Text category="h5">Total Cost:</Text>
      {/* <Text category="h5">{data.totalAmount}</Text> */}
      <Text category="h5">{`₹${totalCost()}`}</Text>
    </Layout>
  );

  const renderProductItem = (
    info: ListRenderItemInfo<Product>
  ): React.ReactElement => (
    <CartItem
      style={styles.item}
      index={info.index}
      product={info.item}
      onProductChange={onItemChange}
      onRemove={onItemRemove}
    />
  );
  const onCheckoutButtonPress = (): void => {
    navigation && navigation.navigate("Payment");
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Layout style={styles.container} level="2">
          {isLoading ? (
            <ActivityIndicator size="large" color="red" />
          ) : (
            <View>
              <List
                data={productss}
                renderItem={renderProductItem}
                ListFooterComponent={renderFooter}
              />
              <Button
                style={styles.checkoutButton}
                size="giant"
                onPress={onCheckoutButtonPress}
              >
                CHECKOUT
              </Button>
            </View>
          )}
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};

const themedStyle = StyleService.create({
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
});
