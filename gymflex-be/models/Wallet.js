const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
    user: {
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
    transactionId: {
        type: String,
    }
});

const Wallet = mongoose.model("Wallet", WalletSchema);

module.exports = Wallet;
