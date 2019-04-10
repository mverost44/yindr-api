const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamps: true
})

module.exports = mongoose.model('Admin', adminSchema)
