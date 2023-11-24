import { Schema, model, models } from "mongoose"

const cartCollection = "cart";

const cartSchema = new Schema({
  designs: {
    type: [
      {
        design: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "designs",
        },
        quantity: Number,
      },
    ],
    default: [],
  },
});

cartSchema.pre("findOne", function () {
  this.populate("design.design");
});

const cartModel = model("carts", cartsSchema);
export default models.cart || cartModel;