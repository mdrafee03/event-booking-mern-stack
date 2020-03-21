const Event = require('../../models/event');
const User = require('../../models/user')
const { dateToString } = require('../../helpers/date');

const events = async eventIds => {
  try {
    const events = await Event.find({_id: {$in: eventIds}});
    const store = events.map(event => {return {...event._doc, creator: user(event.creator)}})
    console.log(store);
    return store;
  } catch(err) {
    throw err;
  }
}
const user = async userId => {
  try {
    return await User.findById(userId);
    // return {...user._doc, createdEvents: events(user.createdEvents)}
  } catch(err) {
    throw err;
  }
}

module.exports = {
  events: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated User');
    }
    try {
      const events = await Event.find()
      return events.map(event => { 
        return {...event._doc, date: dateToString(event.date), creator: user(event.creator) };
      });
    } catch (err) { throw err }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated User');
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date().toISOString(),
      creator: req.userId
    })
    try {
      const createdEvent = await event.save();
      const user = await User.findById(req.userId);
      user.createdEvents.push(event);
      await user.save();
      return {...createdEvent._doc, date: dateToString(createdEvent.date)};
    } catch (err) {
      throw err;
    }
  }
}