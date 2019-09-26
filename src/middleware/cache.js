const redis = require('../../app')

const cache = (req, res, next) => {
	redis.client.get('products', (err, data) => {
		if (err) next(err)

		if (data !== null) {
			res.json({
				status: 200,
				error: false,
				data: JSON.parse(data)
			})
		} else {
			next()
		}
	})
}

module.exports = cache
