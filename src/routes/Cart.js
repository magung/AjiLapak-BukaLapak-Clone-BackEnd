'use strict';
const express = require('express')
const Route = express.Router()
const cartController = require('../controllers/Cart');

Route
.get('/cart', cartController.getCart)
.post('/cart', cartController.addCart)
.patch('/cart/:id', cartController.addQtyCart)
.delete('/cart/:id', cartController.deleteCart)

module.exports = Route
