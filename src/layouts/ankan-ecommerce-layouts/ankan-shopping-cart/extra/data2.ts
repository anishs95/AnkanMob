import { ImageSourcePropType } from "react-native";

export class Product {
  constructor(
    readonly id: number,
    readonly categoryId: string,
    readonly name: string,
    readonly description: string,
    readonly price: number,
    readonly quantity: number,
    readonly unit: number,
    readonly colors: [],
    readonly imageUri: string
  ) {}

  get formattedPrice(): string {
    return `₹${this.price}`;
  }

  get totalPrice(): number {
    return this.price * this.quantity;
  }

  // static pinkChair(): Product {
  //   return new Product(
  //     0,
  //     "Pink Chair",
  //     "Furniture",
  //     require("../assets/image-product-1.png"),
  //     130,
  //     1
  //   );
  // }

  // static blackLamp(): Product {
  //   return new Product(
  //     1,
  //     "Black Lamp",
  //     "Lighting",
  //     require("../assets/image-product-1.png"),
  //     80,
  //     1
  //   );
  // }
}
