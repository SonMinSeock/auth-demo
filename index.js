const express = require("express");
const User = require("./models/user");
const path = require("path");

const app = express();
const PORT = 3000;

// setting
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// router
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/secret", (req, res) => {
  res.send(`This is Secret! You Cannot See Me`);
});

app.listen(PORT, () => console.log(`Server Listen to Port ${PORT}`));
