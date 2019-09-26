'use strict';
const response = require('../libs/response')
const ProductsModel = require('../models/Products')
const CategoriesModel = require('../models/Categories')
const fs = require('fs')
const app = require('../../app')
const _ = require('lodash');
const helper = require('../libs/helper');

exports.getProducts = async (req, res) => {

  let search = req.query.search ? req.query.search : '';
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;
  let filter = req.query.filter ? req.query.filter : 'updateAt';
  let page = req.query.page ? parseInt(req.query.page) : 1;
  let offset = (page - 1) * limit;
  let sort = req.query.sort ? req.query.sort.toLowerCase() : 'desc';
  let totalRows;

  await ProductsModel.countDocuments({
    'name' : {$regex : search, $options: 'i'}
  })
  .then(data => totalRows = data);

  let totalPage = Math.ceil(parseInt(totalRows)/limit);

  await ProductsModel.find({
    'name' : {$regex : search, $options: 'i'}
  })
  .sort({[filter]: sort})
  .limit(limit)
  .skip(offset)
  .then(data => {
    if (data.length > 0) {
      app.client.setex('products', 120, JSON.stringify(data))
      let json = {
        status : 200,
        error: false,
        message : 'success get data products',
        totalRows,
        limit,
        page,
        totalPage,
        data
      };
      response.success(json, res)
    }else{
      res.status(404).json({
				status: 404,
				error: true,
				message: 'Products not found'
			})
    }
  })
  .catch(err => {
    let json = {
      status : 500,
      error: true,
      message : 'Error get data products'
    };
    response.withCode(500,'failed', json, res)
  })
}

exports.getById = async (req, res) => {
  const id = req.params.id
  await ProductsModel.findById(id)
  .then(data => {
    if(data.length !== 0) return response.success(data, res)
    else return response.error('error get product', res)
  })
  .catch(err => {
    response.error('error get product', res)
  })
}

exports.addProduct = async function(req, res) {
  const token = helper.decodeJwt(req.header('authorization'))

  if(!token._id){
    return response.error('error get data seller', res)
  }

  let usersId = token._id;
  let status = 'visible';

  //input from request
  let name = req.body.name;
  let categoriesId = req.body.categoriesId;
  let price = req.body.price;
  let stock = req.body.stock;
  let weight = req.body.weight;
  let image = req.file.filename;
  // let image = 'http://192.168.43.134:8080/products/images/' + req.file.filename;
  // let image = 'http://192.168.0.130:8080/products/images/' + req.file.filename;
  let rate = req.body.rate;
  let description = req.body.description;
  try{
    let checkCategory = await CategoriesModel.findById({_id: categoriesId});

    if(!checkCategory) {
      return response.error('error get data category', res);
    }
  }catch (e){
    return response.error('error get data category', res);
  }

  const product = new ProductsModel({
    name,
    categoriesId,
    usersId,
    price,
    stock,
    weight,
    status,
    description,
    image,
    rate,
  });

  await product.save()
    .then(data => {
      let json = {
        status : 200,
        error: false,
        message : 'success add data product',
        data : data
      };
      response.success(json, res);
    })
    .catch(err => {
      let json = {
        status: 500,
        message: 'error add data product'
      };
      response.withCode(500,'failed', json, res)
    })
}

exports.deleteProduct = async (req, res) => {
  let id = req.params.id

  const token = helper.decodeJwt(req.header('authorization'));

  if (!token._id) {
      return response.error('error get data seller', res);
  }

  let usersId = token._id;
  let del = {
    _id : id
  }
  ProductsModel.findOneAndRemove(del)
  .then(data => {
    if(data){
      // fs.unlinkSync(app.rootPath + '/uploads/products/' + data.image.substr(43))//in server 192.168.43.134
      fs.unlinkSync(app.rootPath + '/uploads/products/' + data.image)//in server 192.168.0.130
      return response.success('product deleted', res)
    }
    else{
      return response.error('error delete product', res)
    }
  })
}

exports.updateProduct = async (req, res) => {
  let id = req.params.id;
  let update = {}

  const token = helper.decodeJwt(req.header('authorization'));

  if (!token._id) {
      return response.error('error get data seller', res);
  }

  Object.keys(req.body).forEach(function(key) {
    if(key == 'name') {
      update['name'] = req.body.name
    }else if (key == 'categoriesId'){
      update['categoriesId'] = req.body.categoriesId
    }else if(key == 'price'){
      update['price'] = req.body.price
    }else if(key == 'stock'){
      update['stock'] = req.body.stock
    }else if(key == 'weight'){
      update['weight'] = req.body.weight
    }else if(key == 'status'){
      update['status'] = req.body.status
    }else if(key == 'rate'){
      update['rate'] = req.body.rate
    }else if(key == 'description'){
      update['description'] = req.body.description
    }
  });


  ProductsModel.findOneAndUpdate({_id : id}, update)
    .then(data => {
      let json = {
        status: 200,
        error: false,
        message: 'success update product',
        data: data
      }
      response.success(json, res)
    })
    .catch(e => {
      response.error('error update product ' + e, res)
    })
}

exports.updatePhotoProduct = async (req, res) => {
  let id = req.params.id;
  let update = {}

  const token = helper.decodeJwt(req.header('authorization'));

  if (!token._id) {
      return response.error('error get data seller', res);
  }


  // if(req.body.image){
    // let image = '192.168.43.134:8080/products/images/' + req.file.filename;
    // let image = '192.168.0.130:8080/products/images/' + req.file.filename;
    let image = req.file.filename;
  ProductsModel.findOneAndUpdate({_id : id}, {image : image})
    .then(data => {
      let json = {
        status: 200,
        error: false,
        message: 'success update photo product',
        data: data
      }
      response.success(json, res)
    })
    .catch(e => {
      response.error('error update photo product ' + e, res)
    })
}

exports.addQtyProduct = async (req, res) => {
    let id = req.params.id
    let counter = 0
    let message = ''
    if(req.body.action === 'add'){
      counter = 1
      message = 'added'
    }else if(req.body.action === 'reduce'){
      counter = -1
      message = 'reduced'
    }

    ProductsModel.updateOne({_id : id}, {$inc: {stock : counter}})
    .then(data => {
      console.log(data)
        let json = {
            status: 200,
            error:false,
            message: 'success ' + message + ' in product with id ' + id,
        };
        return response.success(json, res)
    }).catch(e=>{
        response.error('cannot add or reduce',res)
    })
}
