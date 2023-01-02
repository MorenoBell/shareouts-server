const User = require('../models/User')
const Post = require('../models/Post')
const bcrypt = require('bcryptjs');
const createNewUser = async (rq, res) => {
  const salt = bcrypt.genSaltSync(10);
  const { user, pwd, name, lastName } = rq.body;
  if (user && pwd) {
    const arleadyExUser = await User.findOne({ username: user });
    if (arleadyExUser) {
      res.status(400).json({ "message": "A user with this username arleady exists" });
    }
    else {
      const hashedpw = bcrypt.hashSync(pwd, salt);
      const newUser = await User.create({
        username: user,
        password: hashedpw,
        name: name,
        lastName: lastName,
      });
      res.status(201).json({ "userId": newUser._id });
    }
  }
  else {
    res.status(400).json({ "message": "username or pw not good" })
  }
}

const deleteUser = async (rq, res) => {
  const { userId } = rq.body;
  if (userId) {
    await User.deleteOne({ _id: userId })

    res.status(201).json({ "message": "user eliminated" })
  }
  else {
    res.status(400).json({ "message": "user not found" })
  }
}

const loginUser = async (rq, res) => {
  const { username, password } = rq.body;
  if (username && password) {
    const user = await User.findOne({ username: username })
    let id;
    if (!user) {
      return res.status(400).json({ "message": "user not found" });
    }
    if (user && bcrypt.compareSync(password, user.password)) {
      id = user._id;
    }
    else {
      return res.status(400).json({ "message": "incorrect password" })
    }
    return res.status(201).json({ "id": id })
  }
  else {
    return res.status(400).json({ "message": "user not found" })
  }
}

const userProfile = async (rq, res) => {
  const { loggedUserId, userId } = rq.body;
  const user = await User.findById(userId);
  if (user) {
    const posts = await Post.find({
      _id: { $in: user.posts }
    });
    const friends = await User.find({
      _id: { $in: user.friends }
    });
    if ((loggedUserId != userId)) {
      user.importance += 1;
      user.save();
    }
    const result = {
      user: {
        name: user.name,
        lastName: user.lastName,
        importance: user.importance
      },
      posts: posts,
      friends
    };
    res.status(201).json(result);
  }
  else {
    res.status(400);
  }
}

const searchUsers = async (rq, res) => {
  const { description, userId } = rq.body;
  const list = description.split(' ');
  const optRegexp = [];
  list.forEach(function (opt) {
    if (opt)
      optRegexp.push(new RegExp(opt, "i"));
  });

  if (optRegexp.length == 1) {

    const dbUsers = await User.find({
      $or: [{ name: { $in: optRegexp } },
      { lastName: { $in: optRegexp } }]
    }, '_id name lastName friends').sort({ importance: -1 });
    const users = [];
    dbUsers.forEach(user => {
      let addable = false;
      if (user.friends.find(x => x._id == userId) || user._id == userId) {
        addable = false;
      }
      else {
        addable = true;
      }
      users.push({ ...user.toObject(), addable: addable });
    });
    res.status(201).json({
      users
    })
  }
  else {
    const users = await User.find(
      {
        name: { $in: optRegexp },
        lastName: { $in: optRegexp }
      }
      , '_id name lastName').sort({ importance: -1 });
    res.status(201).json({
      users
    })
  }


}



module.exports = { createNewUser, userProfile, searchUsers, deleteUser, loginUser }