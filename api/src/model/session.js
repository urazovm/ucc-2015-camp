'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SessionSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please name the session'
  },
  items: {
    type: [{
      name: {
        type: String,
        trim: true,
        required: 'Please name the item'
      },
      description: {
        type: String,
        trim: true
      },
      estimates: [Number]
    }],
    default: []
  }
});

module.exports = mongoose.model('Session', SessionSchema);
