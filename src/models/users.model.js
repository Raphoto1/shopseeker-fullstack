import { Schema, model, models } from "mongoose";

const userCollection = "users";

const UserSchema = new Schema(
  {
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: {
      type: String,
      require: true,
      enum: ["fan", "artist", "rafa", "premiumArtist", "admin"],
      default: "user",
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "title cannot be grater than 500 characters"],
    },
    shops: {
      type: Array,
      default: [],
    },
    SocialM: {
      type: Array,
      default: [],
    },
    cart: {
      type: [
        {
          cart: {
            type: Schema.Types.ObjectId,
            ref: cartCollection,
          },
        },
      ],
      default: [],
    },
    last_connection: {
      type: Date,
      default: null,
    },
    avatar: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export default models.user || model("user", UserSchema);
