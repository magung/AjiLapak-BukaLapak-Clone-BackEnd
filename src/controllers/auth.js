'use strict';

// const {sendSms} = require('../libs/sendSms')
const response = require('../libs/response');
const userModel = require('../models/Users');
const authModel = require('../models/auth');
const nodemailer = require('nodemailer');

const bcrypt = require('bcrypt')
const _ = require('lodash');

exports.login = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let check = await userModel.findOne({
        $or : [{username: username}, {email: username}, {phone: username}]
    }).catch(e => {
      return  response.error('User not found', res)
    })

    if(!check){
      return  response.error('User not found', res)
    }

    const validPassword = await bcrypt.compare(password, check.password);
    if(!validPassword){
      return  response.error('Wrong password', res)
    }

     const token = check.generateAuthToken();
    // res.header('authorization', token);

    res.json({
        status: 200,
        error: false,
        message: 'success login',
        data: _.pick(check, ['_id', 'username', 'email', 'phone']),
        token: token
    })

    res.end()
}

exports.register = async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone;
    let gender = req.body.gender;
    let username = req.body.username;
    let password = req.body.password;
    const data = new userModel({
        name,
        email,
        phone,
        gender,
        username,
        password
    })
    let check = await userModel.findOne({
        $or: [{email: email}, {username, username}]
    });

    if(check){
        return response.error('That user already exisits!', res)
    }else {
        await data.save()
            .then(val => {
                let json = {
                    status: 200,
                    error: false,
                    message: 'register success',
                    data: _.pick(val, ['_id', 'name', 'username', 'email', 'phone'])
                };
                const token = data.generateAuthToken();
                res.header('authorization', token);
                res.json(json);
                res.end()
            })
            .catch(err => {
                return response.error('failed register user', res)
            })
    }
}

//forgot password or get otp
exports.getPassword = async (req, res) => {
  let min = 11111;
  let max = 99999;
  let token = Math.floor(Math.random() * (max - min) + min);
  let email = req.body.email;
  console.log(email);

  let check = await userModel.findOne({
    email: email
  }).catch(e => {
      return  response.error('Email User not found', res)
  })

  if(!check){
      return  response.error('Email User not found', res)
  }

  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'admajilapak@gmail.com',
          pass: 'AdminAjilapak2019'
      }
  });

  var mailOptions = {
      from: 'admajilapak@gmail.com',
      to: `${email}`,
      subject: 'Konfirmasi Reset Password',
      text: `Kami telah menerima permintaan kamu untuk reset password akun AjiLapak. Silahkan konfirmasi password dengan token ini : ${token}. Abaikan email ini jika kamu tidak pernah meminta untuk reset password. Untuk pertanyaan, silahkan hubungi admajilapak@gmail.com`,

  };

  transporter.sendMail(mailOptions, (err, info) => {
      if (err) return response.error("system error", res);;
      console.log('Email send: ' + info.response);
          const data = {
              token,
              email
          };

          authModel.update({
              email: email
          }, {
              token,
              email
          }, {
              upsert: true
          })
              .then(respon => {
                let json = {
                  status : 200,
                  error: false,
                  message : 'success get token otp user for authentication forget password',
                  data : data
                }
                return response.success(json, res);
              }).catch(e => {
              response.error(e, res);
          })
  });

}

//get OTP
exports.getOTP = async (req, res) => {
  let min = 11111;
  let max = 99999;
  let token = Math.floor(Math.random() * (max - min) + min);
  let email = req.body.email;
  console.log(email);

  let check = await userModel.findOne({
    email: email
  }).catch(e => {
      return  response.error('Email User not found', res)
  })

  if(!check){
      return  response.error('Email User not found', res)
  }

  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'admajilapak@gmail.com',
          pass: 'AdminAjilapak2019'
      }
  });

  var mailOptions = {
      from: 'admajilapak@gmail.com',
      to: `${email}`,
      subject: 'Penting: Kode Rahasia',
      html: `<b>Hai Pelanggan AjiLapak,</b><br><p> Terima kasih sudah bergabung di AjiLapak! Berikut kode rahasia untuk verifikasi email kamu : </p><h2>${token}</h2><p>Kamu pun bisa melakukan verifikasi email lewat tombol di bawah ini : </p><br><button>Verifikasi Email</button><p>Kalau kamu belum melakukan verifikasi dalam 24 jam, silakan <a>kirim ulang email verifikasi</a>.</p>`,

  };

  transporter.sendMail(mailOptions, (err, info) => {
      if (err) return response.error("system error", res);;
      console.log('Email send: ' + info.response);
          const data = {
              token,
              email
          };

          authModel.update({
              email: email
          }, {
              token,
              email
          }, {
              upsert: true
          })
              .then(respon => {
                let json = {
                  status : 200,
                  error: false,
                  message : 'success get token otp user for register',
                  data : data
                }
                return response.success(json, res);
              }).catch(e => {
              response.error(e, res);
          })
  });

}

exports.cekOTP = async (req, res) => {
    let token = req.body.token;
    let email = req.body.email;

    authModel.find({ token: token, email: email })
    .then(data => {
        if(data.length !== 0){
          let json = {
            status : 200,
            error: false,
            message : 'success get token otp user',
            data : data
          }
          return response.success(json, res);
        }else {
          return response.error('cannot check otp, token or email not valid',res);
        }

    }).catch(err => {
        return response.error('get token or email not valid',res);
    })

};
