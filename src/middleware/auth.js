const jwt = require('jsonwebtoken');
require('dotenv').config()
// exports.decodeJwt = (token, req, res, next) => {
module.exports = function (req, res, next) {
    const token = req.header('authorization');

    if(!token) {
        return res.status(401).json({
            status: 'failed',
            message: ' Access denied. No JWT provided.'
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.PRIMARY_KEY);
        req.user = decoded;
    }catch (e) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid JWT.'
        })
    }
}