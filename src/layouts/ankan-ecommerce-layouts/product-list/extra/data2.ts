import { ImageSourcePropType } from "react-native";

export class Product {
  constructor(
    readonly id: string,
    readonly categoryId: string,
    readonly name: string,
    readonly description: number,
    readonly price: number,
    readonly quantity: number,
    readonly unit: string,
    readonly colors: [],
    readonly imageUri: string,
    readonly productUsage: []
  ) {}

  get formattedPrice(): string {
    return `$${this.price}`;
  }

  get totalPrice(): number {
    return this.price * this.price;
  }
}
