import { AppRegistry, Platform } from "react-native";
import App from "./src/app/app.component";
import { Text } from "@ui-kitten/components";
AppRegistry.registerComponent("KittenTricks", () => App);
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

if (Platform.OS === "web") {
  const rootTag =
    document.getElementById("root") || document.getElementById("main");
  AppRegistry.runApplication("KittenTricks", { rootTag });
}
