import { ImageSourcePropType } from "react-native";

export class PaymentCard {
  constructor(
    readonly number: string,
    readonly logo: ImageSourcePropType,
    readonly cardholderName: string,
    readonly expireDate: string
  ) {}

  static emilyClarckVisa(): PaymentCard {
    return new PaymentCard(
      "4567 5678 7600 4560",
      require("../assets/add-logo.png"),
      "Emily Clarck",
      "10/22"
    );
  }
}

export class Address {
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  zipcode: string;
  state: string;

  constructor(
    addressLine1: string,
    addressLine2: string,
    city: string,
    district: string,
    zipcode: string,
    state: string
  ) {
    this.addressLine1 = addressLine1;
    this.addressLine2 = addressLine2;
    this.city = city;
    this.district = district;
    this.zipcode = zipcode;
    this.state = state;
  }

  //   address(
  //     addressLine1: string,
  //     addressLine2: string,
  //     city: string,
  //     district: string,
  //     zipcode: string
  //   ) {
  //     this.addressLine1 = addressLine1;
  //     this.addressLine2 = addressLine2;
  //     this.city = city;
  //     this.district = district;
  //     this.zipcode = zipcode;
  //   }

  //   static address(
  //     addressLine1: string,
  //     addressLine2: string,
  //     city: string,
  //     district: string,
  //     zipcode: string
  //   ) : Address {

  //   }
}
