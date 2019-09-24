'use strict';

exports.success = function (values, res) {
  const data = {
    status : 'success',
    error : false,
    value : values
  };
  res.status(200);
  res.json(data);
  res.end()
}

exports.error = function (string, res) {
  const data = {
    status : 'failed',
    error : true,
    values : string
  };
  res.status(400);
  res.json(data);
  res.end();
}

exports.withCode = function (code, status, value, res) {
  const data = {
    status : status,
    values : value
  }
  res.status(code);
  res.json(data);
  res.end();
}
