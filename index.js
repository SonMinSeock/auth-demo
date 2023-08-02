// module
const express = require("express");
const User = require("./models/user");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

// MongoDB 연결 작업
mongoose
  .connect("mongodb://127.0.0.1:27017/loginDemo")
  .then(() => console.log("Mongo Connection Open ✅"))
  .catch((err) => console.log("Mongo connecting Error : ", err));

// setting
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//middleware
app.use(express.urlencoded({ extended: true }));

// router
app.get("/", (req, res) => {
  res.send("This is the Home Screen");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", async (req, res) => {
  const {
    body: { username, password },
  } = req;

  // make hash
  const hash = await bcrypt.hash(password, 12);

  // DB Make User
  const user = new User({ username, password: hash });

  await user.save();
  console.log(user);
  res.redirect("/");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  const {
    body: { username, password },
  } = req;

  // 1. find User
  const user = await User.findOne({ username });

  // 2. compare password
  const validPassword = await bcrypt.compare(password, user.password);

  if (validPassword) {
    res.send(`Hello ${user.username}`);
  } else {
    res.send(`Check Your Username or Password!`);
  }
});
app.get("/secret", (req, res) => {
  res.send(`This is Secret! You Cannot See Me`);
});

app.listen(PORT, () => console.log(`Server Listen to Port ${PORT}`));
