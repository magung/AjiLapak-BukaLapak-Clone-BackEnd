'use strict';
const express = require('express')
const Route = express.Router()
const app = require('../../app')
const product = require('../controllers/Products');
const uuidv4 = require('uuid/v4')
const multer = require('multer')
const cache = require('../middleware/cache')

//Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/products')
    },
    filename: function(req, file, cb){
        cb(null, uuidv4() + file.originalname)
    }
});
const upload = multer({storage})


Route
.get('/products/images/:name', (req, res) => {
  res.sendFile(app.rootPath + '/uploads/products/' + req.params.name)
})
.get('/products', cache, product.getProducts)//with redis
// .get('/products', product.getProducts)
.get('/products/:id', product.getById)
.post('/products', upload.single('image'), product.addProduct)
.post('/products/:id', product.addQtyProduct)
.patch('/products/:id', product.updateProduct)
.post('/products/upload_photo/:id', upload.single('image'), product.updatePhotoProduct)
.delete('/products/:id', product.deleteProduct)
module.exports = Route


// module.exports = function (app) {
//   app.route('/products').get(product.getProducts)
//   app.route('/products/:id').get(product.getById)
//   app.route('/products').post(product.addProduct)
//   app.route('/products/:id').patch(product.updateProduct)
//   app.route('/products/:id').delete(product.deleteProduct)
// }
