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
    bcrypt.hash(req.body.password, saltrounds, (err, hash) => {
        let newUser = new User(req.body);
        newUser.password = hash;
        newUser.save().then(() => {
            res.send("New User Created.");
        }).catch((err) => {
            res.send(err);
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({email: req.body.username}).then((foundUser) => {
        if (foundUser){
            bcrypt.compare(req.body.password, foundUser.password, (err, result) => {
                if (err){
                    res.send(err);
                } else {
                    passport.authenticate("local")(req, res, () => {
                        res.send("logged in");
                    })
                }
            })
        }
    })
});



module.exports = router;