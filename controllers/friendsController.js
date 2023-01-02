const User = require('../models/User')

const getFriends = async (rq, res) => {
  const { userId } = rq.body;
  const user = await User.findById(userId);
  if (user) {
    const friends = await User.find({}, 'name lastName _id').where('_id').in(user.friends).exec();
    res.status(201).json(friends);
  }
}

const removeFriend = async (rq, res) => {
  const { userId, id } = rq.body;
  const loggedUser = await User.findOneAndUpdate({ _id: userId }, { "$pull": { "friends": id } });
  const user = await User.findOneAndUpdate({ _id: id }, { "$pull": { "friends": userId } });
  if (loggedUser && user) {
    await loggedUser.save();
    await user.save();
    return res.status(201).json({ "success": "ok" });
  }
  else {
    return res.status(400).json({});
  }
}


const addFriend = async (rq, res) => {
  const { loggedUserId, userToAddId } = rq.body;
  const loggedUser = await User.findOneAndUpdate({ _id: loggedUserId }, { "$push": { "friends": userToAddId } });
  const userToAdd = await User.findOneAndUpdate({ _id: userToAddId }, { "$push": { "friends": loggedUserId } });
  if (loggedUser && userToAdd) {
    await loggedUser.save();
    await userToAdd.save();
    return res.status(201).json({ "success": "ok" });
  }
  else {
    return res.status(400).json({});
  }
}

module.exports = { getFriends, addFriend, removeFriend };