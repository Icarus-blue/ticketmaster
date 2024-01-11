const mongoose = require("mongoose");

const GymSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  name: {
    type: String,
    required: [true, "Please provide gym name"],
  },
  location: {
    type: String,
  },
  classes: {
    type: String,
  },
  facilities: {
    type: String,
  },
  numbers: {
    type: String,
  },
  coaches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach'
  }],
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  image: {
    type: Array, // Assuming you will store the image URL
  },
  trainee : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
});

const Gym = mongoose.model("Gym", GymSchema);

module.exports = Gym;
