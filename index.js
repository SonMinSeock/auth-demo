// module
const express = require("express");
const User = require("./models/user");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");

// 변수 선언문
const app = express();
const PORT = 3000;
const sessionConfig = {
  secret: "h!4+n-2gnjm$vlg-zcwz9w+vn*i+-q4soq3()@*qbt0^rdq(14",
  resave: false,
  saveUninitialized: false,
};

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
app.use(session(sessionConfig));

// router
app.get("/", (req, res) => {
  res.send("반갑습니다!");
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

  // Sessoin Create user_id
  req.session.user_id = user._id;

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
    // Sessoin Create user_id
    req.session.user_id = user._id;

    res.redirect("/secret");
  } else {
    res.redirect(`/login`);
  }
});

app.post("/logout", (req, res) => {
  //1. 세션을 user._id 재할당 할 경우.
  /*
  if (req.session.user_id) {
    req.session.user_id = null;
    res.redirect("/login");
  } else {
    res.redirect("/login");
  }*/

  // 2, 세션을 지우는 방법.
  if (req.session.user_id) {
    req.session.destroy();
    res.redirect("/login");
  } else {
    res.redirect("/login");
  }
});

app.get("/secret", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    res.render("secret");
  }
});

app.listen(PORT, () => console.log(`Server Listen to Port ${PORT}`));
