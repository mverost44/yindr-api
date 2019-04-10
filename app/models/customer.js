const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  profilePicUrl: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fellowCustomer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  }
},
{
  timestamps: true
})

module.exports = mongoose.model('Customer', customerSchema)
