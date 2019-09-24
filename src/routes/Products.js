'use strict';
const product = require('../controllers/Products');
module.exports = function (app) {
  app.route('/products').get(product.getProducts)
  app.route('/products/:id').get(product.getById)
  app.route('/products').post(product.addProduct)
  app.route('/products/:id').patch(product.updateProduct)
  app.route('/products/:id').delete(product.deleteProduct)
}
