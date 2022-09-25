import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
  ImageBackground,
  ListRenderItemInfo,
  View,
} from "react-native";
import {
  Button,
  Card,
  List,
  StyleService,
  Text,
  useStyleSheet,
} from "@ui-kitten/components";
import Spinner from "react-native-loading-spinner-overlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartIcon } from "./extra/icons";
import { Product } from "./extra/data";

const products: Product[] = [];

export const ProductListScreen = ({
  navigation,
  route,
}): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState();
  const componentMounted = useRef(true);
  const [userId, setUserId] = useState<string>();

  const getOrderStatusByUserID = async (userids) => {
    await fetch(
      "https://api.ankanchem.net/purchase/api/Purchase/GetOrdersByOrderId/62711ac41b321cb410eada02" +
        userids,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer 1234",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        console.log("orderd " + JSON.stringify(json));
        // console.log("orderd length" + json.length);

        return json;
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    //  alert("Order Id" + route.params.orderId);
    fetch(
      "https://api.ankanchem.net/purchase/api/Purchase/GetOrdersByOrderId/" +
        route.params.orderId,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer 1234",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        console.log("orderd " + JSON.stringify(json));
        // console.log("orderd length" + json.length);

        return json;
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, [route]);

  // for (var i = 0; i < data.length; i++) {
  //   // console.log("itemss123" + JSON.stringify(data[i].items));
  //   // data2.concat(data[i]);
  //   // console.log("impsder : " + i);
  //   // console.log(data[i].items);
  //   console.log("where : " + i);
  // }

  var products: Product[] = data.items;
  var d = 0;
  console.log("where dataxXX: " + JSON.stringify(data.items));
  for (var i = 0; i < data.length; i++) {
    console.log("where dataxXX: " + JSON.stringify(data[i].items.length));
    // for (var j = 0; j < data[i].items.length; j++) {
    //   products[d] = data[i].items[j];
    //   d++;
    // }
  }

  // for (var i = 0; i < products.length; i++) {
  //   console.log("orderd2 " + JSON.stringify(products[i]));
  // }

  // const displayProducts: Product[] = products.filter(
  //   (product) => checkSwitch(product.status) === route.name
  // );

  const onItemPress = (index: number): void => {
    //alert(index);
    fetch(
      "https://api.ankanchem.net/products/api/Product/GetProduct/" + index,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer 1234",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        const storeData = async (value) => {
          try {
            const jsonValue = JSON.stringify(value);
            console.log("product list 2223:" + jsonValue);
            await AsyncStorage.setItem("@prdDetails", jsonValue);
            console.log("sucess in storing values of product details");
            navigation && navigation.navigate("ProductDetails");
          } catch (e) {
            // saving error
            console.log("failed in storing values of product details" + e);
          }
        };
        storeData(json);

        return json;
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));

    // navigation && navigation.navigate("ProductDetails3");
  };

  const renderItemHeader = (
    info: ListRenderItemInfo<Product>
  ): React.ReactElement => (
    <View style={styles.header}>
      <ImageBackground
        style={styles.itemHeader}
        source={{ uri: info.item.imageUrl }}
      />
      <View style={styles.verticleLine}></View>
      <View>
        <Text
          style={styles.headerText}
          numberOfLines={1}
          adjustsFontSizeToFit
          category="s1"
        >
          {info.item.productName}
        </Text>
        <Text style={styles.contentText} category="c1">
          Total : ₹ {info.item.itemTotal}
        </Text>
        {info.item.color ? (
          <Text style={styles.contentText} category="c1">
            Colour : {info.item.color ? info.item.color.name : "nil"}
          </Text>
        ) : (
          <></>
        )}
        {/* <Text style={styles.contentText} category="c1">
          Colour : {info.item.color ? info.item.color.name : "nil"}
        </Text> */}
        <Text style={styles.contentText} category="c1">
          Quantity : {info.item.quantity}
        </Text>
      </View>
    </View>
  );

  const renderProductItem = (
    info: ListRenderItemInfo<Product>
  ): React.ReactElement => (
    <Card
      style={styles.productItem}
      header={() => renderItemHeader(info)}
      //  footer={() => renderItemFooter(info)}
      onPress={() => onItemPress(info.item.productId)}
    >
      <Text status="info" category="label">
        {info.item.status}
      </Text>
    </Card>
  );

  function checkSwitch(param) {
    console.log("status " + param);
    switch (param) {
      case 0:
        return "Confirmed";
      case 1:
        return "Processed";
      case 2:
        return "CANCELLED";
      case 3:
        return "Shipped";
      case 4:
        return "Delivered";
      case 5:
        return "PartiallyReturned";
      case 6:
        return "RefundCompleted";
      case 7:
        return "RefundInitiated";
      case 8:
        return "RefundProcessed";
      default:
        return "UnKnownStatus";
    }
  }
  return (
    <View>
      <Spinner
        overlayColor="rgba(0, 0, 0, 0.6)"
        size="large"
        visible={false}
        textContent={"Order Details Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      <List
        contentContainerStyle={styles.productList}
        data={products}
        numColumns={1}
        renderItem={renderProductItem}
      />
    </View>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: "background-basic-color-2",
  },
  productList: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  productItem: {
    flex: 1,
    margin: 8,
    maxWidth: Dimensions.get("window").width / 1 - 24,
    backgroundColor: "background-basic-color-1",
  },
  itemHeader: {
    height: 120,
    width: 120,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  header: {
    flexDirection: "row",
  },
  verticleLine: {
    height: "100%",
    width: 0.2,
    backgroundColor: "#909090",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
  },
  contentText: {
    fontSize: 14,
    fontWeight: "normal",
    paddingLeft: 10,
  },
});
