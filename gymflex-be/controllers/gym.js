const Profile = require("../models/Profile");
const Gym = require("../models/Gym");
const User = require('../models/User')
const jwt = require("jsonwebtoken");

exports.getGyms = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    const tokenUser = jwt.verify(token, process.env.ACCESS_SECRET);
    const user = await User.findById(tokenUser._id).populate('gym');
    console.log(user.gym);
    if (user?.gym) {
      const gym = user?.gym;
      const gymarr = [gym]
      res.status(200).json({
        success: true,
        gymarr
      })
    } else {
      res.status(400).json({
        status: false,
        message: "There is no gym data for this user!"
      })
    }

  } catch (err) {
    next(err);
  }
};

exports.registerLocalgym = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    const tokenUser = jwt.verify(token, process.env.ACCESS_SECRET);
    console.log("register localgym : ", tokenUser);
    console.log(req.params.id);
    const gym = await Gym.findByIdAndUpdate(
      req.params.id,
      { $push: { trainee: tokenUser } },
      { new: true }
    );
    res.status(200).json({
      status: true,
      message: "successfully registered"
    })
  } catch (error) {
  }
}

exports.getAllGyms = async (req, res, next) => {
  try {
    const gyms = await Gym.find({});
    res.status(200).json({
      status: true,
      gyms
    })
  } catch (err) {
    next(err);
  }
};

exports.createGym = async (req, res, next) => {
  try {
    const data = req.body;
    const imageUrls = req.files.map((file) => file.path.replace(/\\/g, "/"));
    data.image = imageUrls;
    const gym = await Gym.create(data);
    gym.user = data.userid;
    gym.save();
    const user = await User.findByIdAndUpdate(data.userid, {
      $set: { gym: gym._id }
    }, { new: true })
    res.status(200).json({ success: true, gym: gym, user: user });
  } catch (err) {
    next(err);
  }
};

exports.getGym = async (req, res, next) => {
  try {
    const gym = await Gym.findById(req.params.id).populate('coaches');
    if (!gym) return next(new ErrorResponse(404, "Gym not found"));
    res.status(200).json({ success: true, gym: gym });
  } catch (err) {
    next(err);
  }
};

exports.updateGym = async (req, res, next) => {
  try {
    var data = req.body;
    data.updatedAt = new Date();
    await Gym.findById(req.params.id).updateMany(data);
    const gym = await Gym.findById(req.params.id);
    res.status(200).json({ success: true, gym: gym });
  } catch (err) {
    next(err);
  }
};

exports.deleteGym = async (req, res, next) => {
  try {
    await Gym.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Gym deleted successfully." });
  } catch (err) {
    next(err);
  }
};

