'use strict';
const response = require('../libs/response');
const userModel = require('../models/Users');
const productModel = require('../models/Products');
const HistoryModel = require('../models/History');

const _ = require('lodash');
const helper = require('../libs/helper');

exports.getHistory = async (req, res) => {
    const token = helper.decodeJwt(req.header('authorization'));

    if(!token._id){
        return response.error('error get data users', res);
    }
    let usersId = token._id;

    await HistoryModel.find({user: usersId})
        .populate({path: 'product', model: 'Product'})
        .exec()
        .then(data => {
            response.success(data, res);
        })
        .catch(err => {
            response.error('error get data cart', res);
        });
};
exports.addHistory = async function (req, res) {
    const token = helper.decodeJwt(req.header('authorization'));

    if (!token._id) {
        return response.error('error get data user', res);
    }

    let user = token._id;

    //input from request
    let product = req.body.productId;
    let qty = req.body.qty

    if (product == '' || req.body.productId == null) {
        return response.error('error get data product', res);
    }

    const history = new HistoryModel({
        user,
        product,
        qty
    });

    try {
        let idUser = await userModel.findById({_id: user});

        if (!idUser) {
            return response.error('error get data users', res);
        }
    } catch (e) {
        return response.error('error get data users', res);
    }

    await history.save()
        .then(data => {
            let json = {
                message: 'success add data history',
                data: data
            };

            response.success(json, res)
        })

        .catch(err => {
            let json = {
                status: 500,
                message: 'Error add data history'
            };

            response.error(json, res)
        })
};
exports.deleteHistory = async (req, res) => {
    let id = req.params.id;
    const token = helper.decodeJwt(req.header('authorization'));

    if (!token._id) {
        return response.error('error get data user', res);
    }

    HistoryModel.deleteOne(
        {
            _id : id
        },
    ).then(data=>{
      let json = {
          status: 200,
          error:false,
          message: 'success delete data in history with id ' + id,
      };
      response.success(json, res)
    }).catch(e=>{
        response.error(e,res)
    })

};
