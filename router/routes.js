// import module
const express = require("express");
const router = express.Router();
const User = require("../models/user");

// define middleware
const requireLogin = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  next();
};

// router
router.get("/", (req, res) => {
  res.send("반갑습니다!");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const {
    body: { username, password },
  } = req;

  // DB Make User
  const user = new User({ username, password });

  await user.save();

  // Sessoin Create user_id
  req.session.user_id = user._id;

  res.redirect("/");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const {
    body: { username, password },
  } = req;

  const foundUser = await User.findAndValidate(username, password);

  if (foundUser) {
    // Sessoin Create user_id
    req.session.user_id = foundUser._id;

    res.redirect("/secret");
  } else {
    res.redirect(`/login`);
  }
});

router.post("/logout", (req, res) => {
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

router.get("/secret", requireLogin, (req, res) => {
  res.render("secret");
});

router.get("/topsecret", requireLogin, (req, res) => {
  res.send("Top Secret!!");
});

module.exports = router;
