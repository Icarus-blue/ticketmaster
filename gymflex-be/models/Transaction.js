const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    receiver: {
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

const Transaction = mongoose.model("Deposite", TransactionSchema);

module.exports = Transaction;
