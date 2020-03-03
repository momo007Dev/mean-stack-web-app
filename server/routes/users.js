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
    return res.json( req.body);
});





module.exports = router;


