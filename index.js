// module
const express = require("express");
const path = require("path");
const session = require("express-session");
const rootRoutes = require("./router/routes");
const mongoDBConnect = require("./db/mongodb");

// 변수 선언문
const app = express();
const PORT = 3000;
const sessionConfig = {
  secret: "h!4+n-2gnjm$vlg-zcwz9w+vn*i+-q4soq3()@*qbt0^rdq(14",
  resave: false,
  saveUninitialized: false,
};

// MongoDB 연결
mongoDBConnect();

// setting
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//use middleware
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));

// router setting
app.use("/", rootRoutes);

app.listen(PORT, () => console.log(`Server Listen to Port ${PORT}`));
