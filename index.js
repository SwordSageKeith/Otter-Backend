require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const app = express();
const port = process.env.PORT || 3000;

const passport = require("passport");
const mongoose = require("mongoose");
const mongoPass = require("passport-local-mongoose");
const session = require("express-session");

mongoose.connect("mongodb://127.0.0.1:27017/Otterdb");
const postRoutes = require("./src/routes/posts.route");
const userRoutes = require("./src/routes/users.route");

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

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets",
},
  function (accessToken, refreshToken, profile, cb) {
      User.findOne({ googleId: profile.id }).then((foundUser) => {
          if (foundUser) {
              return foundUser;
          } else {
              const newUser = new User({
                  googleId: profile.id
              });
              return newUser.save();
          }
      }).then((user) => {
          return cb(null, user);
      }).catch((err) => {
          return cb(err);
      });
  }
));


app.get('/', (req, res) => {
  res.render("home");
})
app.get("/authed", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/user/login");
  }
});

app.use('/posts', postRoutes);
app.use("/user", userRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ 'message': err.message });

  return;
});

app.get("/logout", (req, res) => {
    req.logout((err) => {});
    res.redirect("/");
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
