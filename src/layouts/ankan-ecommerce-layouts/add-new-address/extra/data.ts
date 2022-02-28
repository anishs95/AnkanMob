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
