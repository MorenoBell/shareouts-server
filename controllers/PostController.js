const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

const getPosts = async (req, res) => {
  const { userId, userToSearchId, start, range } = req.body;
  let posts = [];
  if (userToSearchId) {
    posts = await Post.find({ creator: userToSearchId }).sort({ _id: -1 }).skip(start).limit(range);
  }
  else {
    posts = await Post.find().sort({ _id: -1 }).skip(start).limit(range);
  }
  const ritorno = [];
  for (const element of posts) {
    const creat = await User.findById(element.creator);
    const creatorDesc = creat.name + ' ' + creat.lastName;
    const deletable = element.creator == userId;
    ritorno.push({ ...element.toObject(), "creatorDescription": creatorDesc, deletable })
  };
  return res.status(201).json(ritorno);
}

const editPost = async (rq, res) => {
  const { postId, text } = rq.body;
  await Post.findOneAndUpdate({ _id: postId }, { description: text });
  res.status(201).json(text);
}

const newPost = async (rq, res) => {
  const { userId, postDescription } = rq.body;
  const newPost = await Post.create({
    description: postDescription,
    creator: userId,
  });
  res.status(201).json({ "status": true });
}

const deletePost = async (rq, res) => {
  const { userId, postId } = rq.body;
  await Post.deleteOne({ _id: postId });
  await Comment.deleteMany({ post: postId });
  const user = await User.findById(userId);
  if (user) {
    await user.posts.pull(postId);
    res.status(201).json({ 'status': true });
  }
  else {
    res.status(201).json({ 'status': false });
  }

}

const likePost = async (rq, res) => {
  const { userId, postId } = rq.body;
  const post = await Post.findById(postId);
  if (post) {
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
    }
    else {
      await post.likes.pull({ _id: userId });

      await post.save();
    }
  }
  res.status(201).json({ "status": true });
}


module.exports = { getPosts, editPost, newPost, likePost, deletePost };
