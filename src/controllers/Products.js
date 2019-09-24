'use strict';
const response = require('../helpers/response')
const ProductsModel = require('../models/Products')
const CategoriesModel = require('../models/Categories')

const _ = require('lodash');
// const helper = require('../helpers/Auth');
exports.getProducts = async (req, res) => {

  let search = req.query.search ? req.query.search : '';
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;
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
    let json = {
      status : 200,
      message : 'success get data products',
      totalRows,
      limit,
      page,
      totalPage,
      data
    };
    response.success(json, res)
  })
  .catch(err => {
    let json = {
      status : 500,
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
  // const token = helper.decodeJwt(req.header('x-auth-token'))

  // if(!token._id){
  //   return response.error('error get data seller', res)
  // }

  // let usersId = token._id;
  let usersId = 'iduser1';
  let status = 'visible';

  //input from request
  let name = req.body.name;
  let categoriesId = req.body.categoriesId;
  let price = req.body.price;
  let stock = req.body.stock;
  let weight = req.body.weight;
  let image = req.body.image;
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

  // const token = helper.decodeJwt(req.header('x-auth-token'));
  //
  // if (!token._id) {
  //     return response.error('error get data seller', res);
  // }
  //
  // let usersId = token._id;
  let del = {
    _id : id
  }

  try{
    ProductsModel.deleteOne(del, function (err, obj) {
      if(err) {
        return response.error('error delete product', res)
      } else {
        return response.success('product deleted', res)
      }
    });
  }catch (e) {
    return response.error('error delete product', res)
  }
}

exports.updateProduct = async (req, res) => {
  let id = req.params.id;
  let update = {}

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
    }else if(key == 'image'){
      update['image'] = req.body.status
    }else if(key == 'rate'){
      update['rate'] = req.body.rate
    }else if(key == 'description'){
      update['description'] = req.body.description
    }
  });

  ProductsModel.findOneAndUpdate({_id : id}, update)
    .then(data => {
      let json = {
        message: 'success update product',
        data: data
      }
      response.success(json, res)
    })
    .catch(e => {
      response.error('error update product ' + e, res)
    })
}
