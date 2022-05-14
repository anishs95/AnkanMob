import { ImageSourcePropType } from "react-native";

export class Product {
  constructor(
    readonly title: string,
    readonly category: string,
    readonly image: ImageSourcePropType,
    readonly price: number,
    readonly amount: number
  ) {}

  get formattedPrice(): string {
    return `$${this.price}`;
  }

  get totalPrice(): number {
    return this.price * this.amount;
  }

  static pinkChair(): Product {
    return new Product(
      "Weber Fine",
      "Pending",
      require("../assets/image-product-1.png"),
      130,
      1
    );
  }

  static whiteChair(): Product {
    return new Product(
      "Roff RainBow",
      "Pending",
      require("../assets/image-product-2.jpg"),
      150,
      1
    );
  }

  static woodChair(): Product {
    return new Product(
      "DewDrops",
      "Cancelled",
      require("../assets/image-product-1.png"),
      125,
      1
    );
  }

  static blackLamp(): Product {
    return new Product(
      "Apex Ultima",
      "Completed",
      require("../assets/image-product-3.jpg"),
      80,
      1
    );
  }
}
