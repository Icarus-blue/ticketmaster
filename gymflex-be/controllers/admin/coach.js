const Profile = require("../../models/Profile");
const Coach = require("../../models/Coach");
const Gym = require('../../models/Gym')
const User = require('../../models/User')
const jwt = require("jsonwebtoken");

exports.getCoaches = async (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        const tokenUser = jwt.verify(token, process.env.ACCESS_SECRET);
        const user = await User.findById(tokenUser._id);
        const gym = await Gym.findById(user.gym).populate({
            path: 'coaches',
            model: 'Coach'
        });
        res.status(200).json({
            success: true,
            coaches: gym.coaches,
        });
    } catch (err) {
        next(err);
    }
};

exports.createCoache = async (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        const tokenUser = jwt.verify(token, process.env.ACCESS_SECRET);
        const data = req.body;
        const imageUrls = req.files.map((file) => file.path.replace(/\\/g, "/"));
        data.image = imageUrls;
        const user = await User.findById(tokenUser._id)
        const gym_user_created  = await Gym.findById(user.gym)
        data.gym = gym_user_created._id;
        console.log('data', data);
        const coach = await Coach.create(data);
        const gym = await Gym.findOneAndUpdate(
            { _id: gym_user_created._id },
            { $push: { coaches: coach } },
            { new: true }
        )
        res.status(200).json({ success: true, user: coach });
    } catch (err) {
        next(err);
    }
};

exports.getCoach = async (req, res, next) => {
    try {
        const user = await Coach.findById(req.params.id);
        if (!user) return next(new ErrorResponse(404, "Profile not found"));
        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

exports.updateCoach = async (req, res, next) => {
    try {
        const data = req.body;
        const imageUrls = req.files.map((file) => file.path.replace(/\\/g, "/"));
        data.image = imageUrls;
        data.updatedAt = new Date();
        await Coach.findById(req.params.id).updateMany(data);
        const user = await Coach.findById(req.params.id);
        res.status(200).json({ success: true, user: user });
    } catch (err) {
        next(err);
    }
};

exports.deleteCoach = async (req, res, next) => {
    try {
        await Coach.findByIdAndDelete(req.params.id);
        // await Profile.deleteMany({ user: req.params.id });
        // await Project.deleteMany({ user: req.params.id });
        res
            .status(200)
            .json({ success: true, message: "User deleted successfully." });
    } catch (err) {
        next(err);
    }
};