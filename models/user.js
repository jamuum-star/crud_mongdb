const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters"],
    maxlength: [30, "Name must be less than 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
    min: [18, "Minimum age is 18"],
    max: [100, "Maximum age is 100"],
  },
});

module.exports = mongoose.model("User", userSchema);
