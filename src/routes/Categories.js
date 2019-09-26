'use strict';
const express = require('express')
const Route = express.Router()
const category = require ('../controllers/Categories');
const redis = require('../../app')

const cache = (req, res, next) => {
	redis.client.get('categories', (err, data) => {
		if (err) next(err)

		if (data !== null) {
      console.log('radis categories working')
			res.json({
				status: 200,
				error: false,
				data: JSON.parse(data)
			})
		} else {
      console.log('radis categories not working')
			next()
		}
	})
}
Route
.get('/categories', cache, category.getCategories)

module.exports = Route
// module.exports = function (app) {
//     app.route('/categories').get(category.getCategories);
//     app.route('/categories').post(category.addCategories);
// };
