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
import PropTypes from "prop-types";

import { CartIcon } from "./extra/icons";
import { Product } from "./extra/data";
import AsyncStorage from "@react-native-async-storage/async-storage";

const products: Product[] = [];

export const CategoryListScreen = ({
  navigation,
  route,
}): React.ReactElement => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const componentMounted = useRef(true);
  const [bearerTocken, setBearerTocken] = React.useState<string>();

  useEffect(() => {
    const getFishAndChips = async () => {
      await AsyncStorage.getItem("bearerTocken", (err, res) => {
        if (!res) {
          console.log("activation id is empty");
        } else {
          // AsyncStorage.setItem("@cartProductId", JSON.stringify([1, 2, 3]));
          setBearerTocken(JSON.parse(res));
          console.log("activation id fetched " + res);
        }
      });

      async () => {
        await console.log("setBearerTocken " + bearerTocken);
      };

      await fetch(
        "https://api.dev.ankanchem.net/products/api/Product/GetProductCategories",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + bearerTocken,
          },
        }
      )
        .then((response) => response.json())
        .then((json) => {
          setData(json);
          return json;
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    };

    if (componentMounted.current) {
      // (5) is component still mounted?
      getFishAndChips();
    }
    return () => {
      // This code runs when component is unmounted
      componentMounted.current = false; // (4) set it to false when we leave the page
    };
  }, []);

  var products: Product[] = data;

  for (var i = 0; i < products.length; i++) {
    console.log("categories " + products[i].name);
  }

  const styles = useStyleSheet(themedStyles);

  const displayProducts: Product[] = products.filter(
    (product) => product.name === route.name
  );

  const onItemPress = (index: number): void => {
    navigation.navigate("ProductList", { catId: index });
  };

  const renderItemFooter = (
    info: ListRenderItemInfo<Product>
  ): React.ReactElement => (
    <View style={styles.itemFooter}>
      <Text category="label">{info.item.uniCodeText}</Text>
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
      source={{ uri: info.item.imageS3Uri }}
    />
  );

  const renderProductItem = (
    info: ListRenderItemInfo<Product>
  ): React.ReactElement => (
    <Card
      style={styles.productItem}
      header={() => renderItemHeader(info)}
      footer={() => renderItemFooter(info)}
      onPress={() => onItemPress(info.item.id)}
    >
      <Text style={styles.title} category="s1">
        {info.item.name}
      </Text>
      <Text appearance="hint" category="c1">
        {info.item.description}
      </Text>
    </Card>
  );

  return (
    <List
      contentContainerStyle={styles.productList}
      data={(displayProducts.length && displayProducts) || products}
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
    paddingHorizontal: 0,
  },

  title: {
    height: 45,
    textAlign: "left",
  },
});
