'use strict';
const express = require('express')
const Route = express.Router()
const historyController = require('../controllers/History');

Route
.get('/history', historyController.getHistory)
.post('/history', historyController.addHistory)
.delete('/history/:id', historyController.deleteHistory)

module.exports = Route
