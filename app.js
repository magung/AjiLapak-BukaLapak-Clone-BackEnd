require('dotenv').config()
const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
app.use(cors());
const port = process.env.PORT || 5000;
const redis_port = process.env.REDIS_PORT || 6379;
const logger = require('morgan');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dbConfig = require('./src/config/database')
const mongoose = require('mongoose');
const redis = require('redis')
const client = redis.createClient(redis_port);


mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.DB, {
  dbName: 'ajilapak',
  useNewUrlParser: true,
  useFindAndModify: false,
}).then(() => {
  console.log('connected success')
}).catch(err => {
  console.log(`connection error`, err)
  process.exit();
})

const routeCategories = require('./src/routes/Categories')
const routeProducts = require('./src/routes/Products')
const routeAuth = require('./src/routes/auth')
const routeUsers = require('./src/routes/Users')
const routeWishlist = require('./src/routes/Wishlist')
const routeCart = require('./src/routes/Cart')
const routeHistory = require('./src/routes/History')

routeAuth(app)
app.use(routeUsers)
app.use(routeProducts)
app.use(routeWishlist)
app.use(routeCart)
app.use(routeCategories)
app.use(routeHistory)

app.use(function(req, res, next) {
  res.status(404).json({
  	status: 404,
  	error: true,
  	message: '404 Page Not Found'
  })
});

app.listen(port, () => console.log("server running on port "+port));

module.exports.client = client
module.exports.rootPath = __dirname
