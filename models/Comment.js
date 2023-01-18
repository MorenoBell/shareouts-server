const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId, ref: 'User'
  },
  post:
    { type: Schema.Types.ObjectId, ref: 'Comment' },
  creationDate:
  {
    type: Date
  }
});

module.exports = mongoose.model('Comment', commentSchema);