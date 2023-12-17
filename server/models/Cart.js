const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    products: [
        {
            productId: { type: Number, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        },
    ],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
