'use strict';
const response = require('../libs/response')
const CategoriesModels = require('../models/Categories')
const app = require('../../app')
exports.getCategories = async (req, res) => {
  let id = req.query.id;

  if (id == '' || typeof id == 'undefined' || id == undefined) {
    await CategoriesModels.find()
      .sort({createAt: 'desc'})
      .then(data => {
          app.client.setex('categories', 120, JSON.stringify(data))
        let json = {
          status: 200,
          message: 'success get data categories',
          data: data
        }
        response.success(json, res)
      })
      .catch(err => {
        let json = {
          status : 500,
          message : 'Error get all data categories'
        };
        response.withCode(500, 'success', json, res)
      })
  }else{
    await CategoriesModels.findById(id)
      .sort({createAt : 'desc'})
      .then(data => {
        let json = {
          status : 200,
          message : 'success get data categories',
          data : data
        }
        response.success(json, res)
      })
      .catch(err => {
        let json = {
          status : 500,
          message : 'Error get data by id categories'
        }
        response.withCode(500, 'success', json, res)
      })
  }
}
exports.addCategories = async function (req, res){
  CategoriesModels.create([
        {
            name: 'Mobil, Part dan Aksesoris',
            imageUrl: 'https://www.bukalapak.com/uploads/category/19/original/Prodak_Kategori_13.jpg'
        }
    ]).then(user => {
        res.json(user)
    });
}
