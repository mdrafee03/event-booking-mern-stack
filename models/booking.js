const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  event: {
    type: mongoose.Types.ObjectId,
    ref: 'Event'
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }
}, {timestamps: true});

module.exports = mongoose.model('Booking', bookingSchema);