const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name "],
      minlength: 3,
      trim: true,
      // match: ['^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$', 'Invalid Email'],
      maxlength: 50,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
    },
    email: {
      type: String,
      required: [true, "Please provide a valid email"],
      unique: true,
      match:
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.createJWT = function () {
  const token = jwt.sign(
    { name: this.name, id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
  return token;
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isPasswordMatch = await bcrypt.compare(
    candidatePassword,
    this.password
  );
  return isPasswordMatch;
};

module.exports = mongoose.model("User", UserSchema);
