'use strict';

var mongoose = require('mongoose');
var List = mongoose.model('List');

exports.addItem = function(req,res){
    var newItem = new List(req.body);
    newItem.save(function (err, item) {
        if (err) return console.error(err);
        console.log(item.item + " saved item to collection.");
        return res.json(item);
      });
}