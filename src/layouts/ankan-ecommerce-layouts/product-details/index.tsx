import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
import { ImageBackground, Platform, View, ScrollView } from "react-native";
import { MinusIcon, PlusIcon } from "./icons";
import Spinner from "react-native-loading-spinner-overlay";
import {
  Button,
  Input,
  Layout,
  Radio,
  RadioGroup,
  StyleService,
  Text,
  useStyleSheet,
} from "@ui-kitten/components";
import { KeyboardAvoidingView } from "./extra/keyboard-avoiding-view.component";
import { CommentList } from "./extra/comment-list.component";
import { Product, ProductColor } from "./extra/data";
import Accordion from "react-native-collapsible/Accordion";

const keyboardOffset = (height: number): number =>
  Platform.select({
    android: 0,
    ios: height,
  });

export default ({ navigation, props }): React.ReactElement => {
  const [comment, setComment] = React.useState<string>();
  const [data, setData] = useState([]);
  const [activeSections, setActiveSections] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [areaSqFt, setAreaSqFt] = React.useState<string>();
  const [noOfBags, setNoOfBags] = React.useState<string>();
  const [disclaimer, setDisclaimer] = React.useState<string>();
  const [selectedColorIndex, setSelectedColorIndex] = React.useState<number>();
  const [quantity, setQuantity] = React.useState<string>();
  const styles = useStyleSheet(themedStyles);
  const [userId, setUserId] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [locationId, setLocationId] = React.useState<string>();

  const SECTIONS = [
    {
      title: "   Consumption Calculator +",
      content: "Lorem ipsum...1",
    },
  ];

  const _renderHeader = (section) => {
    return (
      <View style={styles.header}>
        <Text
          style={styles.sectionLabel}
          style={{ color: "blue" }}
          category="h6"
        >
          {section.title}
        </Text>
        {/* <Text style={styles.headerText}></Text> */}
      </View>
    );
  };

  const _renderContent = (section) => {
    return (
      <View style={styles.consumptionContent}>
        <Input
          placeholder="in sq.feet"
          label="Area"
          autoCapitalize="words"
          value={areaSqFt}
          onChangeText={setAreaSqFt}
        />
        <Button
          style={styles.calBags}
          onPress={onCalculateButtonPress}
          status="warning"
          size={"tiny"}
        >
          Calculate
        </Button>
        <Text style={styles.result} category="h2">
          {noOfBags}
        </Text>
        <Text style={styles.disclaimer} status={"danger"} category="h2">
          {disclaimer}
        </Text>
        {/* <Text>{section.content}</Text> */}
      </View>
    );
  };

  const _updateSections = (activeSections) => {
    setActiveSections(activeSections);
    //yarn setState({ activeSections });
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@prdDetails");
      console.log("PRODUCT DETAILS :- " + jsonValue);
      const val = jsonValue != null ? JSON.parse(jsonValue) : null;
      setData(val);
      setQuantity("1");
      console.log(
        "[PRODUCT DETAILS] Item from parent about product is " + val.id
      );
    } catch (e) {
      console.log("error in reading data ");
    }
  };

  useEffect(() => {
    AsyncStorage.getItem("@cartProductId", (err, res) => {
      if (!res) {
        console.log("cart is empty");
      } else {
        // AsyncStorage.setItem("@cartProductId", JSON.stringify([1, 2, 3]));
        setCartData(JSON.parse(res));
        console.log("Cart id fetched" + JSON.parse(res));
      }
    });
    AsyncStorage.getItem("userId", (err, res) => {
      if (!res) {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("USER ID is Not found");
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
      } else {
        console.log("USER ID " + JSON.parse(res));
        setUserId(JSON.parse(res));
      }
    });
    AsyncStorage.getItem("locationId", (err, res) => {
      if (!res) {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("location ID is Not found");
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
      } else {
        console.log("location ID " + res);
        setLocationId(res);
      }
    });
    getData();
  }, []);

  // console.log("Item from parent about product is " + );
  const onCartButtonPress = (): void => {
    navigation && navigation.navigate("ShoppingCart");
  };
  function addItemToBag() {
    setIsLoading(true);
    //alert(JSON.stringify(data.colors[selectedColorIndex]));
    let color = null;
    // alert(typeof selectedColorIndex != "undefined");
    if (typeof selectedColorIndex != "undefined") {
      color = data.colors[selectedColorIndex];
    }
    fetch(
      "https://api.dev.ankanchem.net/cart/api/Cart/AddItemToCart/" +
        userId +
        "/" +
        locationId,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IlZHb3BpbmF0aCIsIm5iZiI6MTYyMzEzNjY1MSwiZXhwIjoxNjIzMjIzMDUxLCJpYXQiOjE2MjMxMzY2NTF9.fXmdUO49ayKRrc3zSBJbwaMetTOlMcRzoY4AC7U1Zxs",
        },
        body: JSON.stringify({
          ProductId: data.id,
          ProductName: data.name,
          Quantity: parseInt(quantity),
          Color: color,
          unit: data.unit,
        }),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log("[PRODUCT DETAILS add-cart response]" + json);
        setIsLoading(false);
        Toast.show("Item added to the bag", Toast.LONG, [
          "RCTModalHostViewController",
        ]);
        // navigation && navigation.navigate("ShoppingCart");
        return json;
      })
      .catch((error) => {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.error("Add Cart error " + error);
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
        setIsLoading(false);
      });
  }
  const onCalculateButtonPress = (): void => {
    fetch(
      "https://api.dev.ankanchem.net/products/api/Product/GetProductConsumption/" +
        data.id +
        "/" +
        areaSqFt
    )
      .then((response) => response.json())
      .then((json) => {
        setNoOfBags(json + " bags");
        setDisclaimer("** May very with the p.selector");
      })
      .catch((error) => console.error(error));
  };

  const onAddButtonPress = (): void => {
    if (parseInt(quantity) > 0) {
      addItemToBag();
    } else {
      alert("Invalid quantity Choosen");
    }
  };

  const renderColorItem = (
    color: ProductColor,
    index: number
  ): React.ReactElement => (
    <Radio key={index} style={styles.colorRadio}>
      {(evaProps) => (
        <Text {...evaProps} style={{ color: "#" + color.code, marginLeft: 10 }}>
          {color.name.toUpperCase()}
        </Text>
      )}
    </Radio>
  );
  const onMinusButtonPress = (): void => {
    {
      setQuantity((parseInt(quantity) - 1).toString());
      console.log("[PRODUCT DETAILS] " + quantity);
    }
  };
  const onPlusButtonPress = (): void => {
    {
      setQuantity((parseInt(quantity) + 1).toString());
      console.log("[PRODUCT DETAILS] " + quantity);
    }
  };

  const decrementButtonEnabled = (): boolean => {
    return parseInt(quantity) > 1;
  };

  const checkNumber = (e): void => {
    if (e > 0) {
      setQuantity(e);
    } else if (e != " ") {
      // setQuantity(Math.abs(parseInt(e)).toString());
    }
  };
  const renderHeader = (): React.ReactElement => (
    <Layout style={styles.header}>
      <ImageBackground style={styles.image} source={{ uri: data.imageUri }} />
      <Layout style={styles.detailsContainer} level="1">
        <Text category="h6">{data.name}</Text>

        <Text style={styles.price} category="h4">
          ₹ {data.price}
        </Text>
        <Text style={styles.description} appearance="hint">
          {data.description}
        </Text>
        <Text style={styles.sectionLabel} category="h6">
          Size:
        </Text>

        <Text style={styles.size} appearance="hint">
          {data.quantity}
        </Text>
        <Text style={styles.sectionLabel} category="h6">
          Unit:
        </Text>

        <Text style={styles.size} appearance="hint">
          {data.unit}
        </Text>
        <Text style={styles.sectionLabel} category="h6">
          Color:
        </Text>
        <View>
          <ScrollView horizontal={true}>
            <RadioGroup
              style={styles.colorGroup}
              selectedIndex={selectedColorIndex}
              onChange={setSelectedColorIndex}
            >
              {(() => {
                if (data.colors != null) {
                  return data.colors.map(renderColorItem);
                }
              })()}
            </RadioGroup>
          </ScrollView>
        </View>
        <View style={styles.sectionLabelRev}>
          <Text style={styles.sectionLabel} category="h6">
            Quantity:
          </Text>
        </View>
        <View style={styles.amountContainer}>
          <Button
            style={[styles.iconButton, styles.amountButton]}
            size="tiny"
            accessoryLeft={MinusIcon}
            onPress={onMinusButtonPress}
            disabled={!decrementButtonEnabled()}
          />
          <Input
            style={styles.amount}
            keyboardType="numeric"
            onChangeText={setQuantity}
          >
            {quantity}
          </Input>
          <Button
            style={[styles.iconButton, styles.amountButton]}
            size="tiny"
            accessoryLeft={PlusIcon}
            onPress={onPlusButtonPress}
          />
        </View>
        <View style={styles.actionContainer}>
          <Button
            style={styles.actionButton}
            size="large"
            status="success"
            onPress={onCartButtonPress}
          >
            CART
          </Button>
          <Button
            style={styles.actionButton}
            size="large"
            status="info"
            onPress={onAddButtonPress}
          >
            ADD TO BAG
          </Button>
        </View>
      </Layout>
      <Accordion
        sections={SECTIONS}
        activeSections={activeSections}
        //  renderSectionTitle={_renderSectionTitle}
        renderHeader={_renderHeader}
        renderContent={_renderContent}
        onChange={_updateSections}
      />
      <Spinner
        overlayColor="rgba(0, 0, 0, 0.6)"
        size="large"
        visible={isLoading}
        textContent={"Processing..."}
        textStyle={styles.spinnerTextStyle}
      />
    </Layout>
  );

  return (
    <KeyboardAvoidingView style={styles.container} offset={keyboardOffset}>
      <CommentList
        style={styles.commentList}
        data={data.comments}
        ListHeaderComponent={renderHeader()}
      />
    </KeyboardAvoidingView>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: "background-basic-color-2",
  },
  commentList: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    marginBottom: 8,
  },
  consumptionContent: {
    margin: 16,
  },
  image: {
    height: 340,
    width: "100%",
  },
  detailsContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  amountContainer: {
    //position: "absolute",
    flexDirection: "row",
    marginTop: 24,
    left: 4,
    bottom: 8,
  },
  amount: {
    marginLeft: 10,
    marginright: 10,
  },
  subtitle: {
    marginTop: 4,
  },
  price: {
    position: "absolute",
    top: 24,
    right: 16,
  },
  result: {
    top: 24,
    margin: 6,
  },
  disclaimer: {
    margin: 6,
    marginBottom: 36,
    top: 14,
    bottom: 24,
    fontSize: 12,
  },
  description: {
    marginVertical: 16,
  },
  size: {
    marginBottom: 16,
  },
  colorGroup: {
    flexDirection: "row",
    marginHorizontal: -8,
  },
  colorRadio: {
    marginHorizontal: 8,
  },
  actionContainer: {
    flexDirection: "row",
    marginHorizontal: -8,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  sectionLabel: {
    marginVertical: 8,
  },
  sectionLabelRev: {
    flexDirection: "row",
    marginVertical: 8,
  },
  commentInputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "text-basic-color",
  },
  commentInput: {
    marginHorizontal: 16,
    marginVertical: 24,
  },
  iconButton: {
    paddingHorizontal: 8,
    marginLeft: 10,
    marginright: 10,
  },
  amountButton: {
    borderRadius: 36,
  },
  calBags: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});
