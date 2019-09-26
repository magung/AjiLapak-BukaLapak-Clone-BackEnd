'use strict';

const auth = require('../controllers/auth');
module.exports = function(app) {
    app.route('/login').post(auth.login);
    app.route('/register').post(auth.register);
    app.route('/getotp').post(auth.getOTP);
    app.route('/forgot').post(auth.getPassword);
    app.route('/cekotp').post(auth.cekOTP);
}
