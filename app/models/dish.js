const mongoose = require('mongoose')

const dishSchema = new mongoose.Schema({
  imgUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String
  },
  geolocation: {
    type: String,
    required: true
  },
  timetaken: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  healthyRating: {
    type: String
  },
  like: {
    type: Boolean
  },
  numOfLikes: {
    type: Number
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }
},
{
  timestamps: true
})

module.exports = mongoose.model('Dish', dishSchema)
