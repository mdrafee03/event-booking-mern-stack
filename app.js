const express = require('express');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql')
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user')

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    } 
    
    type User {
      _id: ID!
      email: String!
      password: String
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type QueryEvent {
      events: [Event!]!
      users: [User!]!
    }

    type QueryMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }
    schema {
      query: QueryEvent
      mutation: QueryMutation
    }
  `),
  rootValue: {
    events: () => Event.find().catch(err => console.log(err)),
    createEvent: async args => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date().toISOString(),
        creator: '5e6fdb6c0d773e595384aa69'
      })
      const createdEvent = await event.save();
      const user = await User.findById('5e6fdb6c0d773e595384aa69');
      user.createdEvents.push(event);
      await user.save();
      return createdEvent;
    },
    users: async () => {
      try {
        return await User.find()
      } catch (err) {
        throw err
      }
    },
    createUser: async args => {
      try {
        const userexist = await User.findOne({ email: args.userInput.email });
        if (userexist) {
          throw new Error('User exists already!');
        } else {
          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(args.userInput.password, salt);
          const user = new User({
            email: args.userInput.email,
            password: hashedPassword
          })
          const result = await user.save();
          result.password = null;
          return result;
        }
      } catch (err) {
        throw err
      }
    }
  },
  graphiql: true
}))
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD
  }@cluster0-vrywe.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen('3010')
  })
  .catch(err => console.log(err));