require('dotenv').config()
const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
app.use(cors());
const port = process.env.PORT || 5000;
const logger = require('morgan');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dbConfig = require('./src/config/database')
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.DB, {
  dbName: 'ajilapak',
  useNewUrlParse : true,
  useFindAndMOdify: false
}).then(() => {
  console.log('conncted success')
}).catch(err => {
  console.log(`connection success`, err)
  process.exit();
})

const routeCategories = require('./src/routes/Categories')
const routeProducts = require('./src/routes/Products')

routeProducts(app)
routeCategories(app)

app.listen(port, () => console.log("server running on port "+port));
