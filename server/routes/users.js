const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/database');


router.get('/profile', (req, res) => {
    //console.log(res);
    return res.json({
        "Username" : "Test"
    });
});

router.post('/register', (req, res) => {
    // console.log(req.body);
    //return res.json( req.body);
    let newUser = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        contact: req.body.contact,
        password: req.body.password
    });
    User.addUser(newUser, (err, user) => {
        console.log(user);
        if (err) {
            let message = "";
            if (err.errors.username) message = "Username is already taken";
            if (err.errors.email) message += " and Email already exists";
            return res.json({
                success: false,
                message
            });
        } else {
            return res.json({
                success: true,
                message : "User registration is successful !"
            })
        }
    });
});





module.exports = router;


