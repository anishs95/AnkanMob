import { LogBox, View } from "react-native";
import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { RegistarationScreen } from "../scenes/ankan-auth-scenes/registration";
import { LoginScreen } from "../scenes/ankan-auth-scenes/login-screen";
import { OTPScreen } from "../scenes/ankan-auth-scenes/otp-screen";
import { AdminApproval } from "../scenes/ankan-auth-scenes/admin-approval";
import { LogOut } from "../scenes/ankan-auth-scenes/log-out";
import { AnkanHome } from "./ankan.home.navigation";
import { PageSelector } from "../scenes/ankan-auth-scenes/page-selector";

const Stack = createStackNavigator();

export const AnkanNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode="none">
    {/* <Stack.Screen name="Home" component={AnkanHome} /> */}
    {/* <Stack.Screen name="PageSelector" component={PageSelector} /> */}
    <Stack.Screen name="Registration" component={RegistarationScreen} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="OtpScreen" component={OTPScreen} />
    <Stack.Screen name="AdminApproval" component={AdminApproval} />
    <Stack.Screen name="Home" component={AnkanHome} />
    <Stack.Screen name="LogoutScreen" component={LogOut} />
  </Stack.Navigator>
);

LogBox.ignoreLogs(["Accessing the 'state'"]);
