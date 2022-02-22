import React from "react";
import { LogBox } from "react-native";
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeBottomNavigation } from "../scenes/home/home-bottom-navigation.component";
import { HomeDrawer } from "../scenes/home/home-drawer.component";
import { AnkanOffersScreen } from "../scenes/ankan-ecommerce-scenes/ankan-offers.component";
import { AnkanRewardScreen } from "../scenes/ankan-ecommerce-scenes/ankan-rewards.component";
import { AnkanOrderScreen } from "../scenes/ankan-ecommerce-scenes/ankan-orders.components";
import { ProductListScreen } from "../scenes/ankan-ecommerce-scenes/product-list.component";
import { ProductDetailsScreen } from "../scenes/ankan-ecommerce-scenes/product-details.component";
import { Profile1Screen } from "../scenes/social/profile-1.component";
//import { RewardScreen } from "../scenes/social/profile-7.component";
// import { ProductDetails3Screen } from "../scenes/ecommerce/product-details-3.component";
// import { ProductList2Screen } from "../scenes/ecommerce/product-list.component2";
import { CategoryListScreen } from "../scenes/ankan-ecommerce-scenes/category-list.component";
import { ShoppingCartScreen } from "../scenes/ankan-ecommerce-scenes/ankan-shopping-cart.component";
import { PaymentScreen } from "../scenes/ecommerce/payment.component";
import { LibrariesScreen } from "../scenes/libraries/libraries.component";
import { SettingsScreen } from "../scenes/dashboards/settings.component";

const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

/*
 * When dev is true in .expo/settings.json (started via `start:dev`),
 * open Components tab as default.
 */
const initialTabRoute: string = __DEV__ ? "Products" : "Components";

const ROOT_ROUTES: string[] = ["Home", "Products", "Components", "Settings"];

const TabBarVisibilityOptions = ({ route }): BottomTabNavigationOptions => {
  const isNestedRoute: boolean = route.state?.index > 0;
  const isRootRoute: boolean = ROOT_ROUTES.includes(route.name);

  return { tabBarVisible: isRootRoute && !isNestedRoute };
};

const Stack = createStackNavigator();

const HomeTabsNavigatorStack = (): React.ReactElement => (
  <Stack.Navigator headerMode="none" initialRouteName="ProductList2">
    <Stack.Screen name="Category" component={CategoryListScreen} />
    <Stack.Screen name="ShoppingCart" component={ShoppingCartScreen} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    <Stack.Screen name="ProductList" component={ProductListScreen} />
  </Stack.Navigator>
);

const HomeTabsNavigator = (): React.ReactElement => (
  <BottomTab.Navigator
    screenOptions={TabBarVisibilityOptions}
    initialRouteName={initialTabRoute}
    tabBar={(props) => <HomeBottomNavigation {...props} />}
  >
    <BottomTab.Screen name="Products" component={HomeTabsNavigatorStack} />
    <BottomTab.Screen name="Settings" component={SettingsScreen} />
  </BottomTab.Navigator>
);

export const AnkanHome = (): React.ReactElement => (
  <>
    <Drawer.Navigator
      screenOptions={{ gestureEnabled: true }}
      drawerContent={(props) => <HomeDrawer {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeTabsNavigator} />
      <Drawer.Screen name="Rewards" component={AnkanRewardScreen} />
      <Drawer.Screen name="Offers" component={AnkanOffersScreen} />
      <Drawer.Screen name="Orders" component={AnkanOrderScreen} />
      <Drawer.Screen name="Libraries" component={LibrariesScreen} />
      {/* <Drawer.Screen name="Libraries" component={LibrariesScreen} /> */}
    </Drawer.Navigator>
  </>
);

LogBox.ignoreLogs(["Accessing the 'state'"]);
