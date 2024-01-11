const Message = require("../models/Message.js");
const User = require("../models/User.js");
const Chat = require("../models/Chat.js");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const ErrorResponse = require("../utils/errorResponse");

exports.sendMessage = async (req, res, next) => {
  try {
    const {
      body: { sender, receiver, text, time },
    } = req;
    console.log(text);

    if (!sender || !receiver || !text)
      res.status(400).json({
        status: false,
        message: ""
      })

    let newMessage = new Message({
      sender,
      receiver,
      text,
    });
    await newMessage.save();
    res.status(201).json({
      status: true,
      message: "new message added successfully",
    });
  } catch (error) {
  }
};

exports.getAll = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    const tokenUser = jwt.verify(token, process.env.ACCESS_SECRET);
    const userid = tokenUser._id;
    const message = await Message.find({
      $or: [
        { sender: userid },
        { receiver: userid }
      ]
    });
    if (message) {
      res.status(200).json({
        status: true,
        message: message
      })
    } else {
      res.status(200).json({
        status: true,
        message: []
      })
    }
  } catch (err) {

  }
}

exports.getMessage = async (req, res) => {
  try {
    const {
      body: { userid, parnterid },
    } = req;
    let messages = await Message.find({
      $or: [
        { $and: [{ sender: userid }, { receiver: parnterid }] },
        { $and: [{ sender: parnterid }, { receiver: userid }] },
      ]
    })
    res.status(200).json({
      status: true,
      messages,
    });
  } catch (error) {
    console.log("error-adding-message", error.message);
  }
};

exports.unreadNumMessage = async (req, res) => {

  let token = req.headers.authorization.split(" ")[1];
  const tokenUser = jwt.verify(token, process.env.ACCESS_SECRET);

  const chats = await Chat.find({ users: { $elemMatch: { $eq: tokenUser._id } } }).populate('users')

  let results = [];
  for await (let chat of chats) {

    for (var i = 0; i < chat.users.length; i++) {
      if (chat.users[i]._id.toString() === tokenUser._id) {
        chat.users.splice(i, 1);
      }
    }
    let getNum = Message.find({ chat: chat._id, is_read: false, sender: chat.users[0]._id });
    // console.log('Get Message------------------------------------', (await getNum).length)
    results.push({ users: chat.users, num: (await getNum).length })
  }
  res.status(200).json(results);
};
