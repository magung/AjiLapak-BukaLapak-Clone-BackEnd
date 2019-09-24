'use strict';
const response = require('../helpers/response')
const CategoriesModels = require('../models/Categories')

exports.getCategories = async (req, res) => {
  let id = req.query.id;

  if (id == '' || typeof id == 'undefined' || id == undefined) {
    await CategoriesModels.find()
      .sort({createAt: 'desc'})
      .then(data => {
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
            name: 'Handphone',
            children:
                [
                    {name: 'Spare Part & Tools Handphone'},
                    {name: 'Virtual Reality'},
                    {name: 'Smartwatch'},
                    {name: 'HP & Smartphone'},
                    {name: 'Tablet'},
                ]
        }, {
            name: 'Komputer',
            children:
                [
                    {name: 'Hardware'},
                    {name: 'Mini PC'},
                    {name: 'Desktop'},
                    {name: 'Laptop'},
                    {name: 'Server'},
                    {name: 'Printer'},
                ]
        }, {
            name: 'Elektronik',
            children:
                [
                    {name: 'Walkie Talkie'},
                    {name: 'Media Player & Set Top Box'},
                    {name: 'Komponen Elektronik'},
                    {name: 'Aksesoris TV & Video'},
                    {name: 'Voice Recorder'},
                    {name: 'Televisi'},
                ]
        }, {
            name: 'Kamera',
            children:
                [
                    {name: 'Action Camera'},
                    {name: 'Drone'},
                    {name: 'Kamera Digital'},
                    {name: 'Handycam'},
                    {name: 'Kamera Analog'},
                    {name: 'CCTV'},
                ]
        }, {
            name: 'Olahraga',
            children:
                [
                    {name: 'Surfing & Diving'},
                    {name: 'Lari'},
                    {name: 'Badminton'},
                    {name: 'Renang'},
                    {name: 'Pancing'},
                    {name: 'Tenis'},
                ]
        }
    ]).then(user => {
        res.json(user)
    });
}
