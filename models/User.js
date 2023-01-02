const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  importance: {
    type: Number,
    default: 0
  },
  posts: [
    { type: Schema.Types.ObjectId, ref: 'Post' }
  ],
  friends: [
    { type: Schema.Types.ObjectId, ref: 'User' }
  ]
});

module.exports = mongoose.model('User', userSchema);