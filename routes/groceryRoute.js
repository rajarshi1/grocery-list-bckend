'use strict';
module.exports = function(app) {
    // console.log('fromGroceryRoutes');
    var groceryHandlers = require('../controllers/groceryController');
    app.route('/additem')
		.post(groceryHandlers.addItem);
};