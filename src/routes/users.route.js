const express = require('express');
const router = express.Router();
var User = require('../schemas/users.schema');
var saltrounds = 10;

const _ = require("lodash");
const bcrypt = require("bcrypt");
const passport = require("passport");

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

router.get("/register", (req, res) => {
    res.render("register");
});
router.get("/login", (req, res) => {
    res.render("login");
});


router.post('/register', (req, res) => {
    User.register({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }, req.body.password, (err) => {
        if (err) {
            console.log(err);
            res.redirect("/user/register");
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/user/login");
            });
        }
    });
});

router.post("/login", (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(newUser, (err) => {
        if (err) {
            console.log(err);
            res.redirect("/user/login");
        } else {
            console.log("password good");
            passport.authenticate("local")(req, res, () => {
                console.log("authenticated");
                res.redirect("/authed");
            });
        }
    });
});



module.exports = router;