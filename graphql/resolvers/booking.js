const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { dateToString } = require('../../helpers/date');

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find().populate('event').populate('user');
      return bookings.map(booking => {
        return {
          ...booking._doc,
          createdAt: dateToString(booking.createdAt),
          updatedAt: dateToString(booking.updatedAt)
        }
      })
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async args => {
    try {
      const fetchedEvent = await Event.findOne({_id: args.eventId});
      const booking = new Booking({
        event: fetchedEvent,
        user: '5e70772797e6017bb9f0ac78'
      })
      let saved = await booking.save()
      const result = await Booking.findOne({_id: saved._id}).populate('user').populate('event')
      return {
        ...result._doc,
        createdAt: dateToString(booking.createdAt),
        updatedAt: dateToString(booking.updatedAt)
      }
    } catch (err) {throw err}
    
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findOne({event: args.eventId});
      await Booking.deleteOne({ _id: booking._id});
      return await Event.findOne({_id: args.eventId}).populate('creator');
    } catch(err) {throw err}
  }
}