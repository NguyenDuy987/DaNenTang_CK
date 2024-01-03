const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    products: [
        {
            productId: { type: String, required: true },
            productTitle: { type: String, require: true },
            productImage: { type: String, require: true },
            price: { type: Number, required: true },
            description: { type: String },
            authors: { type: String },
            categories: { type: String },
            rate: { type: Number },
            count: { type: Number }
        },
    ],
});

const Favorites = mongoose.model('Favorites', favoriteSchema);

module.exports = Favorites;