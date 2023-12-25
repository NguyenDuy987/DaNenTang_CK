const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    TotalPrice: { type: Number },
    deliveryAdress: [
        {
            houseNumber: { type: String },
            street: { type: String },
            city: { type: String },
        }
    ],
    products: [
        {
            productId: { type: String, required: true },
            productTitle: { type: String, require: true },
            productImage: { type: String, require: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        },
    ],
    status: {
        type: String,
        enum: ['In Transit', 'Delivered', 'Returned'],
        default: 'In Transit', // Trạng thái mặc định là 'In Transit'
    },
    /*
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    */
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;