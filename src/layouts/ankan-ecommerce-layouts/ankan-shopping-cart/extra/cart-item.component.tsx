import React from "react";
import { Image, StyleSheet, View } from "react-native";
import {
  Button,
  ListItem,
  ListItemProps,
  Text,
  Input,
} from "@ui-kitten/components";
import { CloseIcon, MinusIcon, PlusIcon } from "./icons";
import { Product } from "./data2";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type CartItemProps = ListItemProps & {
  index: number;
  product: Product;
  cartId: string;
  onProductChange: (product: Product, index: number) => void;
  onRemove: (product: Product, index: number) => void;
};

export const CartItem = (props: CartItemProps): React.ReactElement => {
  const {
    style,
    product,
    index,
    cartId,
    onProductChange,
    onRemove,
    ...listItemProps
  } = props;
  const [quantityx, setQuantityx] = React.useState<string>();
  const decrementButtonEnabled = (): boolean => {
    return product.quantity > 1;
  };

  const onRemoveButtonPress = (): void => {
    onRemove(product, index);
  };

  const [userId, setUserId] = React.useState<string>();

  function updateItem(x) {
    AsyncStorage.getItem("userId", (err, res) => {
      if (!res) {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("USER ID is Not found");
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
      } else {
        console.log("USER ID " + res);
        setUserId(res);
        addItemToBag(x, res);
      }
    });
  }

  function addItemToBag(x, userIds) {
    var URL;
    if (cartId == null) {
      URL =
        "https://api.ankanchem.net/cart/api/Cart/AddItemToCart/" +
        userIds +
        "/" +
        "<location>";
    } else {
      URL =
        "https://api.ankanchem.net/cart/api/Cart/AddItemToCart/" +
        userIds +
        "/" +
        cartId +
        "/<location>";
    }

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
        Quantity: x,
        Color: product.colorsObject,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(
          "[PRODUCT DETAILS add-cart updated response]" + JSON.stringify(json)
        );

        // navigation && navigation.navigate("ShoppingCart");
        return json;
      })
      .catch((error) => {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.error("Add Cart error " + error);
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
      });
  }
  // const onMinusButtonPress = (): void => {
  //   console.log("sasa :" + JSON.stringify(product));
  //   const updatedProduct: Product = new Product(
  //     product.id,
  //     product.categoryId,
  //     product.name,
  //     product.description,
  //     product.price,
  //     product.quantity - 1,
  //     product.unit,
  //     product.colors,
  //     product.imageUrl
  //   );
  //   updateItem(-1);
  //   onProductChange(updatedProduct, index);
  // };

  // const onPlusButtonPress = (): void => {
  //   const updatedProduct: Product = new Product(
  //     product.id,
  //     product.categoryId,
  //     product.name,
  //     product.description,
  //     product.price,
  //     product.quantity + 1,
  //     product.unit,
  //     product.colors,
  //     product.imageUrl
  //   );
  //   updateItem(1);
  //   onProductChange(updatedProduct, index);
  // };
  const setQuantity = (): void => {
    let qua = parseInt(quantityx) - product.quantity;
    if (parseInt(quantityx) > 0) {
      const updatedProduct: Product = new Product(
        product.id,
        product.categoryId,
        product.name,
        product.description,
        product.price,
        parseInt(quantityx),
        product.unit,
        product.colors,
        product.imageUrl,
        product.colorsObject
      );
      updateItem(qua);
      onProductChange(updatedProduct, index);
    }
  };
  return (
    <ListItem {...listItemProps} style={[styles.container, style]}>
      <Image style={styles.image} source={{ uri: product.imageUrl }} />
      <View style={styles.detailsContainer}>
        <Text style={{ fontWeight: "bold" }} category="s1">
          {product.name}
        </Text>
        <Text category="s2">{product.colors}</Text>
        <Text category="s2">₹{product.formattedPrice}</Text>
        <View style={styles.amountContainer}>
          {/* <Button
            style={[styles.iconButton, styles.amountButton]}
            size="tiny"
            accessoryLeft={MinusIcon}
            onPress={onMinusButtonPress}
            disabled={!decrementButtonEnabled()}
          /> */}
          {/* <Text style={styles.amount} category="s2">
            {`${product.quantity}`}
          </Text> */}
          <Input
            style={styles.amount2}
            keyboardType="number-pad"
            onChangeText={setQuantityx}
            onBlur={setQuantity}
          >
            {product.quantity}
          </Input>
          {/* <Button
            style={[styles.iconButton, styles.amountButton]}
            size="tiny"
            accessoryLeft={PlusIcon}
            onPress={onPlusButtonPress}
          /> */}
        </View>
      </View>
      <Button
        style={[styles.iconButton, styles.removeButton]}
        appearance="ghost"
        status="basic"
        accessoryLeft={CloseIcon}
        onPress={onRemoveButtonPress}
      />
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  image: {
    width: 120,
    height: 144,
  },
  detailsContainer: {
    flex: 1,
    height: "100%",
    padding: 16,
  },
  amountContainer: {
    marginTop: 10,
    flexDirection: "row",
  },
  amountButton: {
    borderRadius: 16,
  },
  amount: {
    textAlign: "center",
    width: 40,
  },
  amount2: {
    marginLeft: 10,
    marginRight: 10,
  },
  removeButton: {
    position: "absolute",
    right: 0,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
});
