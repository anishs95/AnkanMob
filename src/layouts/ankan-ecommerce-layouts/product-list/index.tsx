import React, { useState, useEffect, useCallback } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Tab, TabBar } from "@ui-kitten/components";

import { ProductListScreen } from "./product-list.component";

const ProductsTabBar = ({ navigation, state }): React.ReactElement => {
  const [cat, setCat] = useState("1");
  const [vals, setVals] = useState(0);

  const appendCat = useCallback((cat) => {}, []);

  const onTabSelect = (index: number): void => {
    // setTimeout(() => (index = index + 1), 3000);
    console.log("index value " + JSON.stringify(state));
    console.log("index value " + index);
    navigation.navigate(state.routeNames[index]);
  };

  const renderTab = (route: string): React.ReactElement => (
    <Tab key={route} title={route.toUpperCase()} />
  );

  // setTimeout(() => {
  //   setVals(vals + 1);
  //   onTabSelect(vals);
  // }, 3000);

  return (
    <TabBar selectedIndex={state.index} onSelect={onTabSelect}>
      {state.routeNames.map(renderTab)}
    </TabBar>
  );
};

const TopTabs = createMaterialTopTabNavigator();

export default ({ navigation }): React.ReactElement => (
  <ProductListScreen navigation={navigation}></ProductListScreen>
  // <TopTabs.Navigator tabBar={(props) => <ProductsTabBar {...props} />}>
  //   <TopTabs.Screen
  //     name="Product List"
  //     // initialParams={{ catId: 1 }}
  //     component={ProductListScreen}
  //   />

  //   {/* <TopTabs.Screen name="Lighting" component={ProductListScreen} /> */}
  // </TopTabs.Navigator>
);
