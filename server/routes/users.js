const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Users = require('../models/users').Users;


router.get('/profile', (req, res) => {
    //console.log(res);
    return res.json({
        "Username": "Test"
    });
});

router.post('/register', (req, res) => {
    // console.log(req.body);
    //return res.json( req.body);
    let newUser = new Users({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        contact: req.body.contact,
        password: req.body.password
    });
    User.addUser(newUser, (err, user) => {
        if (err) {
            let message = "";
            if (err.errors.username) message = "Username is already taken";
            if (err.errors.email) message += " and Email already exists";
            return res
                .status(500)
                .json({
                success: false,
                message
            });
        } else {
            return res.json({
                success: true,
                message: "User registration is successful !"
            })
        }
    });
});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.getUserByUsername(username, (err, user) => {
        if (err) {
            return console.log(err);
        }
        if (!user) {
            res.json({
                success: false,
                message: "User not found"
            });
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) {
                return console.log("toto ");
            } else if (isMatch) {
                const token = jwt.sign({
                    type: "user",
                    data: {
                        _id: user._id,
                        username: user.username,
                        name: user.name,
                        email: user.email,
                        contact: user.contact
                    }
                }, process.env.DB_PASS, {
                    expiresIn: 604800 // for 1 week time in milleseconds
                });
                return res.json({
                    success: true,
                    token: "JWT" + token
                });
            } else {
                return res.json({
                    success: true,
                    message: "Wrong password"
                })
            }
        })
    })
});

// get auth user profile
router.get('/profile-auth', passport.authenticate('jwt', {session: false}), (req, res) => {
    return res.json({
        "hello": "test"
    });
});


module.exports = router;


