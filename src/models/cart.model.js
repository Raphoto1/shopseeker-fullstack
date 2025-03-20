import { Schema, model, models } from "mongoose"
import designCollection from "../models/design.model"

const cartCollection = "carts";

const cartSchema = new Schema({
  designs: {
    type: [
      {
        design: {
          type: Schema.Types.ObjectId,
          ref: designCollection,
        },
        quantity: Number,
      },
    ],
    default: [],
  },
});

cartSchema.pre("findOne", function () {
  this.populate("designs.design");
});


export default models.carts || model("carts", cartSchema);