const Profile = require("../models/Profile");
const Gym = require("../models/Gym");
const User = require('../models/User')
const WalletSchema = require('../models/Wallet')
const Activity = require('../models/ActivityHistory')

const jwt = require("jsonwebtoken");


exports.getActivity = async (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        const tokenUser = jwt.verify(token, process.env.ACCESS_SECRET);
        const activity = await Activity.find({ user: tokenUser._id })
            .populate('localgym')
            .populate('indiv_coach')
        if (activity.length > 0) {
            res.status(200).json({
                status: true,
                activity: activity
            })
        } else {
            res.status(200).json({
                status: false,
                message: "You have no activity now !"
            })
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};
