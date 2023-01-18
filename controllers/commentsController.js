const User = require('../models/User')
const Comment = require('../models/Comment')
const Post = require('../models/Post');

const getCommentsByPost = async (rq, res) => {
  const { userId, postId } = rq.body;
  const comments = await Comment.find({ post: postId });
  const returnArr = [];
  for (const com of comments) {
    let editable = false;
    if (com.creator._id.toString() == userId) {
      editable = true;
    }
    const creator = await User.findById(com.creator._id.toString())
    returnArr.push({ ...com.toObject(), editable, creatorName: creator.name, creatorLastName: creator.lastName })
  }
  res.status(201).json(returnArr);
}

const editComment = async (rq, res) => {
  const { id, text } = rq.body;
  await Comment.findOneAndUpdate({ _id: id }, { description: text });
  res.status(201).json(text);
}

const newComment = async (rq, res) => {
  const { commentText, userId, postId } = rq.body;
  const comment = await Comment.create({
    description: commentText,
    creator: userId,
    post: postId,
    creationDate: Date.now()
  });
  const creator = await User.findById(comment.creator._id.toString())
  const ritorno = { ...comment.toObject(), editable: true, creatorName: creator.name, creatorLastName: creator.lastName };
  res.status(201).json({ ritorno });
}

module.exports = { getCommentsByPost, newComment, editComment };


