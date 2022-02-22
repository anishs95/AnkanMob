import { ImageSourcePropType } from "react-native";

export class Training {
  constructor(
    readonly title: string,
    readonly duration: string,
    readonly kcal: string,
    readonly image: ImageSourcePropType
  ) {}

  // get formattedDuration(): string {
  //   const hours: number = Math.floor(this.duration / 60);
  //   const minutes: number = this.duration % 60;

  //   return `${hours}:${minutes} min`;
  // }

  get formattedKcal(): string {
    return `${this.kcal} kcal`;
  }

  static workoutForWomen(): Training {
    return new Training(
      "First Order",
      "30/05/2021",
      "₹ 200/-",
      require("../assets/offer1.png")
    );
  }

  static groupWorkout(): Training {
    return new Training(
      "Purchase above 10000/-",
      "15/06/2021",
      "₹ 250/-",
      require("../assets/offer2.png")
    );
  }

  static gymnastics(): Training {
    return new Training(
      "Refer a friend",
      "25/06/2021",
      "₹ 30/-",
      require("../assets/offer1.png")
    );
  }
}
