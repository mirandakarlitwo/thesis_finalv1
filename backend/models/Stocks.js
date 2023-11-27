import { Schema, model } from "mongoose";

const StocksSchema = new Schema(
  {
    productId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
    },
    quantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Stocks = model("Stocks", StocksSchema);

export default Stocks;
