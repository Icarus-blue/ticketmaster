const User = require("../models/User");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");


exports.updateUser = async (req, res, next) => {
  try {
    const {
      body: { fullName, email, location, role, bio }
    } = req;
    let token = req.headers.authorization.split(" ")[1];
    const tokenUser = jwt.verify(token, process.env.ACCESS_SECRET);
    const user = await User.findById(tokenUser._id);

    if (!user) res.status(400).json({
      status: false,
      message: 'there is no user!'
    })

    user.fullName = fullName;
    user.email = email;
    user.location = location; 
    user.role = role;
    user.bio = bio;

    if (req.file) {
      user.avatar.data = req.file.buffer;
      user.avatar.contentType = req.file.mimetype;
    }

    const updateduser = await user.save();

    res.status(200).json({
      status: true,
      message: "user was updated successfully",
      updateduser: updateduser
    });

  } catch (err) {
    next(err);
  }
};


exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id })
    if (!user) return next(new ErrorResponse(404, "User not found"));
    res.status(200).json({ success: true, user: user });
  } catch (err) {
    next(err);
  }
};




