// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const CartItemSchema = new Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Producto",
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 1,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
// });


// const CartSchema = new Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: false,
//   },
//   items: [CartItemSchema],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// CartSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// // Exportar los modelos
// const Cart = mongoose.model("Cart", CartSchema);
// const CartItem = mongoose.model("CartItem", CartItemSchema);

// module.exports = { Cart, CartItem };
