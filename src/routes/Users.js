'use strict';
const express = require('express')
const Route = express.Router()
const app = require('../../app')
const user = require('../controllers/Users');
const uuidv4 = require('uuid/v4')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/users')
    },
    filename: function(req, file, cb){
        cb(null, uuidv4() + file.originalname)
    }
});
const upload = multer({storage})

Route
  .get('/users/images/:name', (req, res) => {
    res.sendFile(app.rootPath + '/uploads/users/' + req.params.name)
  })
  .get('/users', user.getUsers)
  .post('/users/upload_photo', upload.single('imageUrl'), user.uploadPhotoProfil)
  .patch('/users', user.updateUsers)
module.exports = Route
