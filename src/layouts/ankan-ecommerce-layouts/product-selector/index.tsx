import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  ListRenderItemInfo,
  StyleSheet,
  View,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Button, Card, List, Text, Layout } from "@ui-kitten/components";

import ModalDropdown from "react-native-modal-dropdown";

export default ({ navigation }): React.ReactElement => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [temp, setTemp] = useState([]);
  const onBuyButtonPress = (): void => {
    console.log(JSON);
    navigation.navigate("ProductList", { catId: data });
  };
  useEffect(() => {
    fetch(
      "https://api.dev.ankanchem.net/products/api/Product/GetProductTypeMasters",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer ",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        console.log("PRODUCT SELECTOR " + json);

        function jsonToMap(jsonString) {
          console.log("--------1-------");
          console.log(JSON.stringify(jsonString));
          //var jsonObject = JSON.parse(jsonString);
          // var dataObject = jsonObject.data;
          var dataMap = new Map(Object.entries(jsonString));
          var resultMap = new Map();
          for (const key of dataMap.keys()) {
            var keyMap = new Map(Object.entries(dataMap.get(key)));
            console.log("-------2--------");
            console.log(keyMap);
            resultMap.set(key, keyMap);
          }

          console.log("done!");
          console.log(JSON.stringify(data[3].types));
          return resultMap;
        }
        return json;
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, []);

  const elements = ["one", "two", "three"];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Layout style={styles.container} level="2">
          {isLoading ? (
            <ActivityIndicator size="large" color="red" />
          ) : (
            <View>
              {data.map((value, index) => {
                return (
                  <Card
                    style={styles.bookingCard}
                    appearance="filled"
                    disabled={true}
                    // footer={renderBookingFooter}
                  >
                    <View>
                      <Text
                        style={styles.textbox}
                        category={"h6"}
                        status={"basic"}
                        appearance={"default"}
                      >
                        {value.typeCategory}
                      </Text>
                      {/* <Text>{JSON.stringify(value.types)}</Text> */}
                      {/* {setTemp(value.types)} */}
                      <ModalDropdown
                        options={value.types.map((value2, index2) => {
                          return value2.typeName;
                        })}
                        dropdownTextStyle={styles.dropdown_3_dropdownTextStyle}
                        style={styles.dropdown_5}
                        isFullWidth
                        textStyle={styles.dropdown_2_text}
                        onSelect={(index3, value3) => {
                          temp[index] = value.typeCategory + ":" + (index3 + 1);
                        }}
                      />
                      {/* <DropDownPicker
                  open={open}
                  value={valueX}
                  items={value.types.map((value2, index2) => {
                    return value2.typeName;
                  })}
                  setOpen={setOpen}
                  setValue={setValueX}
                  setItems={setData}
                /> */}
                    </View>
                  </Card>
                );
              })}

              <Button onPress={onBuyButtonPress}>FIND</Button>
            </View>
          )}
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  bookingCard: {
    margin: 8,
  },
  bottomCenter: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 30,
  },
  container: {
    flex: 1,
  },
  item: {
    borderRadius: 0,
    marginVertical: 8,
  },
  itemHeader: {
    height: 160,
  },
  textbox: {
    marginTop: -14,
    marginLeft: -14,
    fontSize: 14,
    fontFamily: "bold",
  },
  dropdown_5: {
    marginTop: 8,
    borderColor: "lightgray",
    height: 50,
    borderWidth: 0.5,
    borderRadius: 10,
  },
  itemFooter: {
    flexDirection: "row",
    marginTop: 16,
    marginHorizontal: -4,
  },
  activityButton: {
    marginHorizontal: 4,
    paddingHorizontal: 0,
  },
  dropdown_2_text: {
    marginVertical: 10,
    marginHorizontal: 16,
    fontSize: 18,
    color: "black",
    textAlign: "center",
    textAlignVertical: "center",
  },
  dropdown_3_dropdownTextStyle: {
    // backgroundColor: "#000",
    // color: "#fff",
    marginHorizontal: 16,
    fontSize: 12,
  },
});
