const mongoose = require('mongoose');

const ActivtiSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    amount: {
        type: Number,
        require: true
    },
    starttime: {
        type: String,
    },
    endtime: {
        type: String,
    },
    sessionTime: {
        type: String,
        require: true
    },
    localgym: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gym"
    },
    indiv_coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    updatedAt: {
        type: Date,
        default: new Date(),
    },
    transactionId: {
        type: String,
    }
})

const Activity = mongoose.model('Activity', ActivtiSchema);

module.exports = Activity;