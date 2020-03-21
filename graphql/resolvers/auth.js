const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user')

module.exports = {
  users: async () => {
    try {
      return await User.find().populate('createdEvents');
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
        return { ...result._doc, password: null };
      }
    } catch (err) {
      throw err
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error('User not found');
      }
      if (!bcrypt.compareSync(password, user.password)) {
        throw new Error('Password is Incorrect!');
      }
      const token = jwt.sign({ userId: user.id, email: email }, 'supersecretkey', { expiresIn: '1h' });
      return { userId: user.id, token: token, tokenExpiration: 1 }
    } catch (err) {
      throw err;
    }
  }
}