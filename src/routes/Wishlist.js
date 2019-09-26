'use strict';
const express = require('express')
const Route = express.Router()
const wishlistController = require('../controllers/Wishlist');

Route
.get('/wishlist', wishlistController.getWishlist)
.post('/wishlist', wishlistController.addWishlist)
.delete('/wishlist/:id', wishlistController.deleteWishlist)

module.exports = Route
