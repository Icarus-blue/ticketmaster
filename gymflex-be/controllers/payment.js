const Profile = require("../models/Profile");
const Gym = require("../models/Gym");
const User = require('../models/User')
const WalletSchema = require('../models/Wallet')
const Activity = require('../models/ActivityHistory')

const jwt = require("jsonwebtoken");
const {
    createOrder,
    capturePayment,
    generateAccessToken,
    generateClientToken,
    handleResponse,
    Payout
} = require("../utils/paypal")

exports.depositController = async (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        const tokenUser = jwt.verify(token, process.env.ACCESS_SECRET);
        const { amount } = req.body;
        const user = await User.findById(tokenUser._id);
        const wallet = await WalletSchema.findOne({ user: tokenUser._id })
        if (!wallet) {
            const wallet = await WalletSchema.create({
                user: tokenUser._id,
                amount: amount,
            })
            user.wallet = wallet;
            user.save();
            res.status(200).json({
                status: true,
                message: 'You successfully deposited money!',
                wallet: wallet
            })
        } else {
            const updatedamount = Number(wallet?.amount) + Number(amount);
            wallet.amount = updatedamount;
            wallet.save();
            res.status(200).json({
                status: true,
                message: 'You successfully deposited money!',
                wallet: wallet
            })
        }

        // const payoutToAdmin = await Payout(amount);
        // if (payoutToAdmin.data.status) {

        //     res.status(200).json({
        //         status: true,
        //         res: wallet
        //     });
        // } else {

        // }

    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.payToLocalGym = async (req, res, next) => {
    try {
        const {
            body: {
                gymid, amount, starttime, endtime, sessionTime
            }
        } = req;

        const receiver = await User.findOne({ gym: gymid })
        if (!receiver) res.status(400).json({
            status: false,
            message: "There is no user."
        })

        let token = req.headers.authorization.split(" ")[1];
        const tokenUser = jwt.verify(token, process.env.ACCESS_SECRET);
        const senderid = tokenUser._id;

        // const order = await createOrder(amount);
        const senderwallet = await WalletSchema.findOne({ user: senderid });
        const receiverwallet = await WalletSchema.findOne({ user: receiver._id });
        const activity = await Activity.create({ user: senderid, amount: amount, localgym: gymid, sessionTime: sessionTime });

        if (senderwallet) {
            if (Number(senderwallet?.amount) > Number(amount)) {
                // if (order.data.status) {
                const existingmoney_sender = senderwallet.amount;
                const updatedamount_sender = Number(existingmoney_sender) - Number(amount);
                const existingmoney_receiver = receiverwallet.amount;
                const updatedamount_receiver = Number(existingmoney_receiver) + Number(amount);
                receiverwallet.amount = updatedamount_receiver.toFixed(2);
                receiverwallet.save();
                senderwallet.amount = updatedamount_sender.toFixed(2);
                senderwallet.save();
                res.status(200).json({
                    status: true,
                    message: 'you successfully paid',
                    remaindmoney: updatedamount_sender.toFixed(2)
                })
                // } else {
                //     res.status(400).json({
                //         status: false,
                //         message: 'Order is not completed now due to your network issue!Please try again'
                //     })
                // }

            } else {
                res.status(400).json({
                    status: false,
                    message: "you have no enough money to pay such amount of money to this user , Please deposite first now!"
                })
            }
        } else {
            res.status(400).json({
                status: false,
                message: "you have to depoist first,Please deposite first now!"
            })
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.payToIndividualCoach = async (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        const tokenUser = jwt.verify(token, process.env.ACCESS_SECRET);

        const { amount } = req.body;
        const payoutToAdmin = await Payout(amount);

        if (payoutToAdmin.data.status) {
            const wallet = await WalletSchema.create({
                user: tokenUser._id,
                amount: amount,
            })
            res.status(200).json({
                status: true,
                res: wallet
            });
        } else {

        }

    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.adminCreateWallet = async (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        const tokenUser = jwt.verify(token, process.env.ACCESS_SECRET);
        const { amount } = req.body;
        const user = await User.findById(tokenUser._id);
        const wallet = await WalletSchema.findOne({ user: tokenUser._id });
        if (!wallet) {
            const wallet = await WalletSchema.create({
                user: tokenUser._id,
                amount: 0,
            })
            user.wallet = wallet;
            user.save();
            res.status(200).json({
                status: true,
                message: 'You successfully created wallet!',
                wallet: wallet
            })
        } else {
            res.status(200).json({
                sattus: true,
                message: 'you already created wallet.'
            })
        }

    } catch (err) {
        res.status(400).json({
            status: 400,
            message
        })
    }
}

exports.getadminWallet = async (req, res, next) => {

}