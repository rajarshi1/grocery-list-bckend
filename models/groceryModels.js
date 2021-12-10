// 'use strict';

// var mongoose = require('mongoose'),
//   // bcrypt = require('bcrypt'),
//   Schema = mongoose.Schema;
//   // var ObjectId = Schema.ObjectId;
//   // console.log(ObjectId);

// var GroceryList = new Schema({
//   item: {
//     type: String,
//     trim: true,
//     required: true
//   },
//   quantity: {
//     type: Number,
//     default: 1
//     // required: true
//   },
//   isCompleted:{
//     type: Boolean,
//     default: false
//   },
//   created: {
//     type: Date,
//     default: Date.now
//   }
// });

// // UserSchema.methods.comparePassword = function(password) {
// //   return bcrypt.compareSync(password, this.hash_password);
// // };

// mongoose.model('List', GroceryList);