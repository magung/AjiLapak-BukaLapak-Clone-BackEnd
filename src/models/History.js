'use strict';

const mongoose = require('mongoose');
const HistorySchema = new mongoose.Schema({
        user: {
            type: String,
            ref: 'users'
        },
        product: {
            type: String,
            ref: 'products'
        },
        qty: {
            type: Number,
            required: true,
            default: 1
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('History', HistorySchema);
