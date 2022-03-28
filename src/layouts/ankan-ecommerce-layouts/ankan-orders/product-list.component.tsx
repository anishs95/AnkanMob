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
      "https://api.dev.ankanchem.net/purchase/api/Purchase/GetOrdersByUser/" +
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
    const unsubscribe = navigation.addListener("focus", () => {
      const getFishAndChips = async () => {
        await AsyncStorage.getItem("userId", (err, res) => {
          if (!res) {
            console.log("userId id is empty");
          } else {
            setUserId(res);
            getOrderStatusByUserID(res);
            console.log("userId id fetched " + res);
          }
        });
      };
      getFishAndChips();
    });

    return unsubscribe;
  }, []);

  for (var i = 0; i < data.length; i++) {
    // console.log("itemss123" + JSON.stringify(data[i].items));
    // data2.concat(data[i]);
    // console.log("impsder : " + i);
    // console.log(data[i].items);
    console.log("where : " + i);
  }
  var products: Product[] = [];
  var d = 0;
  for (var i = 0; i < data.length; i++) {
    console.log("where datax: " + JSON.stringify(data[i].items.length));
    for (var j = 0; j < data[i].items.length; j++) {
      products[d] = data[i].items[j];
      d++;
    }
  }

  for (var i = 0; i < products.length; i++) {
    console.log("orderd2 " + JSON.stringify(products[i]));
  }

  const displayProducts: Product[] = products.filter(
    (product) => checkSwitch(product.status) === route.name
  );

  const onItemPress = (index: number): void => {
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
        <Text style={styles.contentText} category="c1">
          Colour : {info.item.color ? info.item.color.name : "nil"}
        </Text>
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
      onPress={() => onItemPress(info.index)}
    >
      <Text status="info" category="label">
        {checkSwitch(info.item.status)}
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
        visible={isLoading}
        textContent={"Order Details Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      <List
        contentContainerStyle={styles.productList}
        data={(displayProducts.length && displayProducts) || products}
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
    fontSize: 10,
    fontWeight: "normal",
    paddingLeft: 10,
  },
});
