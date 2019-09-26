'use strict';
const mongoose = require('mongoose');
const auth = new mongoose.Schema({
    token: {
        type: String,
        default: '',
        required: true
    },
    email: {
        type: String,
        default: '',
        required: true
    }
},  {
    timestamps: true
});

module.exports = mongoose.model('Auth', auth);
