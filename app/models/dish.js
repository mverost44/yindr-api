const mongoose = require('mongoose')

const dishSchema = new mongoose.Schema({
  imgUrl: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  geolocation: {
    type: String,
    required: true
  },
  timetaken: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Dish', dishSchema)
