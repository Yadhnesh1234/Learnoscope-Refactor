const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  profilePicture: {
    type: String,
  },
  firstName: {
    type: String,
    required: [true, "First Name is required."],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required."],
    trim: true,
  },
  username: {
    type: String,
    required: [true, "Username is required."],
    unique: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: "Please enter a valid 10-digit phone number.",
    },
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "Please enter a valid email address.",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// this is executed just before saving the data to the database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  // if the password is modified,then hash the password
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// method to check if the login password is correct
UserSchema.methods.correctPassword = async function (
  candidatePassword,
  actualPassword
) {
  // this will return true if both are same
  return await bcrypt.compare(candidatePassword, actualPassword);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
