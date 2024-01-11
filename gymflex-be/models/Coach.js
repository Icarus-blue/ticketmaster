const mongoose = require("mongoose");

const CoachSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide full name"],
    },
    email: {
        type: String,
    },
    address: {
        type: String,
    },
    numbers: {
        type: String,
    },
    password: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    updatedAt: {
        type: Date,
        default: new Date(),
    },
    gym: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym'
    }],
    image: {
        type: Array, // Assuming you will store the image URL
    },
});

const Coach = mongoose.model("Coach", CoachSchema);

module.exports = Coach;
