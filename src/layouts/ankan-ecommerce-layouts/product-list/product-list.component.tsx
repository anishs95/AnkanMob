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
import { CartIcon } from "./extra/icons";
import { Product } from "./extra/data2";

const products: Product[] = [];

export const ProductListScreen = ({ navigation }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [isLoading, setLoading] = useState(true);

  const [data, setData] = useState([]);
  const [categoryIDnumber, setcategoryIDnumber] = useState(String);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@categoryIDnumber");
      console.log("categoryIDnumber :- " + jsonValue);
      setcategoryIDnumber(jsonValue);
    } catch (e) {
      console.log("error in reading data product list ");
    }
  };
  useEffect(() => {
    fetch(
      "https://api.dev.ankanchem.net/products/api/Product/GetAllProducts/" +
        categoryIDnumber
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

    getData();
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
      <Text category="h6">₹ {info.item.price}</Text>
      <Button
        style={styles.iconButton}
        size="small"
        accessoryLeft={CartIcon}
        onPress={() => onItemCartPress(info.index)}
      />
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
    <List
      contentContainerStyle={styles.productList}
      data={products}
      numColumns={2}
      renderItem={renderProductItem}
    />
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
});
