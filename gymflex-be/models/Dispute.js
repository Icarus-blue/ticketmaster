const mongoose = require("mongoose");

const DisputeSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    requested: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    amount: {
        type: Number,
        require: true
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    updatedAt: {
        type: Date,
        default: new Date(),
    },
});

const Dispute = mongoose.model("Deposite", DisputeSchema);

module.exports = Dispute;
