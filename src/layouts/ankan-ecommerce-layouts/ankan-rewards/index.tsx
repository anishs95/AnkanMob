import React, { useEffect } from "react";
import {
  Image,
  ImageSourcePropType,
  Dimensions,
  ListRenderItemInfo,
  ScrollView,
  View,
} from "react-native";
import {
  Button,
  Card,
  Divider,
  List,
  StyleService,
  Text,
  ListItem,
  useStyleSheet,
} from "@ui-kitten/components";
import { ImageOverlay } from "./extra/image-overlay.component";
import { Product, ProductOption } from "./extra/data";
import AsyncStorage from "@react-native-async-storage/async-storage";

const product: Product = Product.centralParkApartment();

export default ({ navigation }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [isLoading, setIsLoading] = React.useState(false);
  const [totalEarnedReward, setTotalEarnedReward] = React.useState<string>();
  const [data, setData] = React.useState<[]>();
  // const data = new Array(8).fill({
  //   title: "Item",
  //   description: "Description for Item",
  // });

  const onBookButtonPress = (): void => {};
  useEffect(() => {
    console.log("called");
    getUserId();
  }, [navigation]);

  const getUserId = async () => {
    try {
      const usrId = await AsyncStorage.getItem("userId");
      fetch(
        "https://api.dev.ankanchem.net/rewards/api/Rewards/GetUserReward/" +
          usrId
      )
        .then((response) => response.json())
        .then((json) => {
          setTotalEarnedReward("₹ " + json.totalEarnedReward + "/-");
          console.log(JSON.stringify(json.totalEarnedReward));
        })
        .catch((error) => console.error("error44" + error))
        .finally(() => setIsLoading(false));

      fetch(
        "https://api.dev.ankanchem.net/rewards/api/Rewards/GetRewardsByUser/" +
          usrId
      )
        .then((response) => response.json())
        .then((json) => {
          console.log("//////////////////HISTORY/////////////////////");
          setData(json);
          console.log(JSON.stringify(json));
        })
        .catch((error) => console.error("error44" + error))
        .finally(() => setIsLoading(false));
    } catch (e) {
      console.log("error in reading data ");
    }
  };

  const renderItem2 = ({ item, index }) => (
    <ListItem title={`${item.createdDate} `} description={`${item.status}`} />
  );

  const renderItem = ({ item, index }) => (
    <Card status="success" style={styles.card}>
      <Text>Created Date : {`${item.createdDate.substring(0, 10)} `}</Text>
      <Text>Purchase Amount : ₹{`${item.purchaseAmount}/- `}</Text>
      <Text>Points : {`${item.points} `}</Text>
      <Text>Status : {`${item.status} `}</Text>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <ImageOverlay style={styles.image} source={product.primaryImage} />
      <Card
        style={styles.bookingCard}
        appearance="filled"
        disabled={true}
        // footer={renderBookingFooter}
      >
        <Text style={styles.title} category="h6">
          {product.title}
        </Text>
        <Text style={styles.rentLabel} appearance="hint" category="p2">
          Total Reward
        </Text>
        <Text style={styles.priceLabel} category="h6">
          {totalEarnedReward}
          {/* {product.price.formattedValue} */}
        </Text>
        {/* <Button style={styles.bookButton} onPress={onBookButtonPress}>
          Claim
        </Button> */}
      </Card>
      <Text style={styles.sectionLabel} category="s1">
        Reward Status
      </Text>
      <List
        style={styles.container}
        data={data}
        ItemSeparatorComponent={Divider}
        renderItem={renderItem}
      />
    </ScrollView>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: "background-basic-color-2",
  },
  image: {
    height: 360,
  },
  bookingCard: {
    marginTop: -80,
    margin: 16,
  },
  title: {
    width: "85%",
  },
  rentLabel: {
    marginTop: 24,
  },
  priceLabel: {
    marginTop: 8,
  },
  card: {
    margin: 16,
    borderRadius: 8,
  },
  bookButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
  },
  detailsList: {
    flexDirection: "row",
    marginHorizontal: -4,
    marginVertical: 8,
  },
  detailItem: {
    marginHorizontal: 4,
    borderRadius: 16,
  },
  optionList: {
    flexDirection: "row",
    marginHorizontal: -4,
    marginVertical: 8,
  },
  optionItem: {
    marginHorizontal: 4,
    paddingHorizontal: 0,
  },
  description: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionLabel: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  imagesList: {
    padding: 8,
    backgroundColor: "background-basic-color-2",
  },
  imageItem: {
    width: 180,
    height: 120,
    borderRadius: 8,
    marginHorizontal: 8,
  },
});
