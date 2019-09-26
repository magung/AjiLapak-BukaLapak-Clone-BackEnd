'use strict';

const mongoose = require('mongoose');
const WishlistSchema = new mongoose.Schema({
        user: {
            type: String,
            ref: 'users'
        },
        product: {
            type: String,
            ref: 'products'
        },
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Wishlist', WishlistSchema);
