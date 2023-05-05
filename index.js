require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const app = express();
const port = process.env.PORT || 3000;

const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");

mongoose.connect("mongodb://127.0.0.1:27017/Otterdb");
const postRoutes = require("./src/routes/posts.route");
const userRoutes = require("./src/routes/users.route");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.json({ 'message': 'ok' });
})
app.get("/authed", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("authed");
  } else {
    res.redirect("/user/login");
  }
});
// app.get("/register", (req, res) => {
//   res.render("register");
// });
// app.get("/login", (req, res) => {
//   res.render("login");
// });


app.use('/posts', postRoutes);
app.use("/user", userRoutes);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ 'message': err.message });

  return;
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${port}`)
});