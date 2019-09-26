'use strict';
const response = require('../libs/response');
const userModel = require('../models/Users');
const productModel = require('../models/Products');
const cartModel = require('../models/Cart');

const _ = require('lodash');
const helper = require('../libs/helper');

exports.getCart = async (req, res) => {
    const token = helper.decodeJwt(req.header('authorization'));

    if(!token._id){
        return response.error('error get data users', res);
    }
    let usersId = token._id;

    await cartModel.find({user: usersId})
        .populate({path: 'product', model: 'Product'})
        .exec()
        .then(data => {
          let json = {
            status : 200,
            error: false,
            message : 'success get data cart',
            data : data
          }
          response.success(json, res);
        })
        .catch(err => {
            response.error('error get data cart', res);
        });
};
exports.addCart = async function (req, res) {
    const token = helper.decodeJwt(req.header('authorization'));

    if (!token._id) {
        return response.error('error get data user', res);
    }

    let user = token._id;

    //input from request
    let product = req.body.productId;

    if (product == '' || req.body.productId == null) {
        return response.error('error get data product', res);
    }

    const cart = new cartModel({
        user,
        product
    });

    try {
        let idUser = await userModel.findById({_id: user});

        if (!idUser) {
            return response.error('error get data users', res);
        }
    } catch (e) {
        return response.error('error get data users', res);
    }

    await cart.save()
        .then(data => {
          let json = {
              status: 200,
              error:false,
              message: 'success add data Wishlist',
              data: data
          };

          response.success(json, res)
        })

        .catch(err => {
            let json = {
                status: 500,
                message: 'Error add data Cart'
            };

            response.error(json, res)
        })
};
exports.deleteCart = async (req, res) => {
    let id = req.params.id;
    const token = helper.decodeJwt(req.header('authorization'));

    if (!token._id) {
        return response.error('error get data user', res);
    }

    cartModel.deleteOne(
        {
            _id : id
        },
    ).then(data=>{
      let json = {
          status: 200,
          error:false,
          message: 'success delete data in cart with id ' + id,
      };
      response.success(json, res)
    }).catch(e=>{
        response.error(e,res)
    })

};

exports.addQtyCart = async (req, res) => {
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

    cartModel.updateOne({_id : id}, {$inc: {qty : counter}})
    .then(data => {
        let json = {
            status: 200,
            error:false,
            message: 'success ' + message + ' in cart with id ' + id,
        };
        return response.success(json, res)
    }).catch(e=>{
        response.error('cannot add or reduce',res)
    })
}
