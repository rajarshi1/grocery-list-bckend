'use strict';

var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  Schema = mongoose.Schema;


var UserSchema = new Schema({
  fullName: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  hash_password: {
    type: String
  },
  groceryList: {},
  created: {
    type: Date,
    default: Date.now
  }
});

var GroceryList = new Schema({
    item: {
      type: String,
      trim: true,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
      // required: true
    },
    isCompleted:{
      type: Boolean,
      default: false
    },
    created: {
      type: Date,
      default: Date.now
    },
    user: {
        type: Schema.ObjectId, 
        ref: 'User'
    },
  });

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.hash_password);
};

const User = mongoose.model('User', UserSchema);
const List = mongoose.model('List', GroceryList);