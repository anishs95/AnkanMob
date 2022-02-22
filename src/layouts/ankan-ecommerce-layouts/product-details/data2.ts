import { ImageSourcePropType } from "react-native";

export class Product1 {
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
}
