import { Schema, model } from "mongoose";

const OrdersSchema = new Schema(
  {
    name: {
      type: String,
    },
    items: [
      {
        productName: {
          type: String,
        },
        quantity: {
          type: Number,
        },
        price: {
          type: Number,
        }
      },
    ],
    contact: {
      type: Number,
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Orders = model("Orders", OrdersSchema);

export default Orders;
