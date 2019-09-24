'use strict';
const category = require ('../controllers/Categories');

module.exports = function (app) {
    app.route('/categories').get(category.getCategories);
    // app.route('/categories').post(category.addCategories);
};
