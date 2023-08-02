const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: [true, "Username cannot be blank"] },
  password: { type: String, required: [true, "Password cannot be blank"] },
});

userSchema.statics.findAndValidate = async function (username, password) {
  const foundUser = await this.findOne({ username });
  const isValid = await bcrypt.compare(password, foundUser.password);

  return isValid ? foundUser : false;
};

userSchema.pre("save", async function (next) {
  // check modified password filed
  if (!this.isModified("password")) return next();

  // make hash
  this.password = await bcrypt.hash(this.password, 12);
  next(); // call save
});

const User = mongoose.model("User", userSchema);

module.exports = User;
