import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { CartIcon } from "./extra/icons";
import { Product } from "./extra/data2";

const products: Product[] = [];

export const ProductListScreen = ({
  navigation,
  route,
}): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [isLoading, setLoading] = useState(true);

  const [data, setData] = useState([]);
  const [dataParam, setDataParam] = useState({});
  const [categoryIDnumber, setcategoryIDnumber] = useState(String);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@categoryIDnumber");
      const lcnId = await AsyncStorage.getItem("locationId");
      console.log("categoryIDnumber :- " + jsonValue);
      setcategoryIDnumber(jsonValue);

      console.log("categoryIDnumber in use :- " + jsonValue);
      fetch(
        "https://api.dev.ankanchem.net/products/api/Product/GetAllProductsByCategory/" +
          jsonValue +
          "/" +
          lcnId
      )
        .then((response) => response.json())
        .then((json) => {
          setData(json);
        })
        .catch((error) => console.error("This error" + error))
        .finally(() => setLoading(false));
    } catch (e) {
      console.log("error in reading data product list ");
    }
  };

  const getData2 = async (par) => {
    try {
      // const jsonValue = await AsyncStorage.getItem("@categoryIDnumber");
      dataParam["TileProductSelectorSearch"] = JSON.parse(par);
      const lcnId = await AsyncStorage.getItem("locationId");
      console.log("lcnId in here :- " + lcnId);
      console.log(
        "route.params.pselect in here2 :- " + JSON.stringify(dataParam)
      );

      fetch(
        "https://api.dev.ankanchem.net/products/api/product/FindProductsByProductSelector/" +
          lcnId +
          "/60c8aaab54657b3c4296e938",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IlZHb3BpbmF0aCIsIm5iZiI6MTYyMzEzNjY1MSwiZXhwIjoxNjIzMjIzMDUxLCJpYXQiOjE2MjMxMzY2NTF9.fXmdUO49ayKRrc3zSBJbwaMetTOlMcRzoY4AC7U1Zxs",
          },
          body: JSON.stringify(dataParam),
        }
      )
        .then((response) => response.json())
        .then((json) => {
          setData(json);
          //console.log("Here is the psele" + JSON.stringify(json));
          return json;
        })
        .catch((error) => {
          console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
          console.error("Product Selector error " + error);
          console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
        })
        .finally(() => setLoading(false));
    } catch (e) {
      console.log("error in reading data product list ");
    }
  };

  useEffect(() => {
    // console.log("me here" + JSON.stringify(route.params.pselect));
    var pselectenabled = typeof route.params != "undefined";
    console.log("me here 3" + pselectenabled);
    if (pselectenabled) {
      console.log("me here" + JSON.stringify(route.params.pselect));
      setDataParam(JSON.stringify(route.params.pselect));
      getData2(JSON.stringify(route.params.pselect));
    } else {
      getData();
    }
  }, []);

  var products: Product[] = data;

  const onItemPress = (prdDetails: []): void => {
    console.log("data here " + prdDetails);

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
    storeData(prdDetails);
  };

  const onItemCartPress = (index: number): void => {
    navigation && navigation.navigate("ShoppingCart");
  };

  const renderItemFooter = (
    info: ListRenderItemInfo<Product>
  ): React.ReactElement => (
    <View style={styles.itemFooter}>
      <Text status="primary" category="h6">
        ₹ {info.item.price}
      </Text>
      {/* <Button
        style={styles.iconButton}
        size="small"
        accessoryLeft={CartIcon}
        onPress={() => onItemCartPress(info.index)}
      /> */}
    </View>
  );

  const renderItemHeader = (
    info: ListRenderItemInfo<Product>
  ): React.ReactElement => (
    <ImageBackground
      style={styles.itemHeader}
      source={{ uri: info.item.imageUri }}
    />
  );

  const renderProductItem = (
    info: ListRenderItemInfo<Product>
  ): React.ReactElement => (
    <Card
      style={styles.productItem}
      header={() => renderItemHeader(info)}
      footer={() => renderItemFooter(info)}
      onPress={() => onItemPress(info.item)}
    >
      <Text style={styles.title} category="s1">
        {info.item.name}
      </Text>
      {/* <Text appearance="hint" category="c1">
        ₹. {info.item.price}
      </Text> */}
    </Card>
  );

  return (
    <View>
      <Spinner
        overlayColor="rgba(0, 0, 0, 0.6)"
        size="large"
        visible={isLoading}
        textContent={"Products Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      <List
        contentContainerStyle={styles.productList}
        data={products}
        numColumns={2}
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
    maxWidth: Dimensions.get("window").width / 2 - 24,
    backgroundColor: "background-basic-color-1",
  },
  itemHeader: {
    height: 140,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  iconButton: {
    backgroundColor: "#0095D9",
    borderColor: "#0095D9",
    paddingHorizontal: 0,
  },
  title: {
    height: 40,
    textAlign: "left",
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});
