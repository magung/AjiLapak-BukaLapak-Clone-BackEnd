'use strict';
const response = require('../libs/response');
const UserModels = require('../models/Users');
const helper = require('../libs/helper');
const _ = require('lodash')
const fs = require('fs')
// const aws = require('aws-sdk');

exports.getUsers = async (req, res) => {
    const token = helper.decodeJwt(req.header('authorization'));

    if(!token._id){
        return response.error('error get data users', res);
    }
    await UserModels.findOne({_id: token._id})
    // await UserModels.find()
    .then(data => {
        let json = {
            message: 'success get data users',
            data: _.pick(data, ['_id', 'name', 'username', 'email', 'imageUrl', 'phone', 'gender', 'birth'])
        }
        response.success(json, res)
    })
    .catch(err => {
        response.error('error get data users', res)
    })
}

exports.updateUsers = async function (req, res) {
  const token = helper.decodeJwt(req.header('authorization'));

  if(!token._id){
      return response.error('error update data users', res);
  }

  let check = await UserModels.findOne({_id: token._id});

  if(check){
    await UserModels.findOneAndUpdate({ _id: token._id }, req.body)
      .then((data) => {
        if(!data){
          response.error('error update data users', res)
        }
      })
      .catch((e) => {
        response.error('error update data users', res)
      });

    await UserModels.findOne({_id: token._id})
      .then(data => {
        let json = {
            message: 'success update data users',
            data: _.pick(data, ['_id', 'name', 'username', 'email', 'imageUrl', 'phone', 'gender', 'birth'])
        }
        response.success(json, res)
      })
      .catch(err => {
          response.error('error update data users', res)
      })
  }
  else{
    return response.error('error update data user', res)
  }
}

exports.uploadPhotoProfil = async (req, res) => {
  const token = helper.decodeJwt(req.header('authorization'));

  if(!token._id){
      return response.error('error update data users', res);
  }

  let check = await UserModels.findOne({_id: token._id});
  let imageUrl = '192.168.43.134:8080/users/images/' + req.file.filename;
  if(check){
    await UserModels.findOneAndUpdate({ _id: token._id }, {imageUrl: imageUrl})
      .then((data) => {
        console.log(data)
        let json = {
            message: 'success upload photo users',
        }
        return response.success(json , res)
      })
      .catch((e) => {
        response.error('error update data users', res)
      });
    }else{
      return response.error('error update data users', res)
    }
}
