const Post = require('../models/Post');
const User = require('../models/User');

const getPosts = async (req, res) => {
  const { userId, userToSearchId } = req.body;
  let posts = [];
  if (userToSearchId) {
    posts = await Post.find({ creator: userToSearchId });
  }
  else {
    posts = await Post.find();
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
  const post = await Post.findOne({ id: postId, creator: userId });
  const user = await User.findById(userId);
  if (post) {
    await post.remove();
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


module.exports = { getPosts, newPost, likePost, deletePost };
