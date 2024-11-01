import mongoose, { Schema } from "mongoose";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password?: string;
  following?: mongoose.Schema.Types.ObjectId[];
  googleId: string;
  isDesigner: boolean;
  addresses?: mongoose.Schema.Types.ObjectId[];
  phone?: string;
  name?: string;
  description?: string;
  DesignerId?: { type: mongoose.Schema.Types.ObjectId };
  cart: { product: mongoose.Schema.Types.ObjectId; quantity: number }[];
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: { type: String },

    googleId: { type: String },

    phone: { type: String },
    name: { type: String },
    description: { type: String },

    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "Designer",
      },
    ],
    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    isDesigner: { type: Boolean, default: false },
    DesignerId: {
      type: Schema.Types.ObjectId,
      ref: "Designer",
    },
    cart: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "FinalProduct",
        },
        quantity: Number,
      },
    ],
  },
  { timestamps: true },
);

const user = mongoose.model<IUser>("User", UserSchema);
// eslint-disable-next-line import/prefer-default-export
export { user };
