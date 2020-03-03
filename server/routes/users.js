const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/database');


router.get('/profile', (req, res) => {
    return res.json({
        "Username" : "Test"
    });
});





module.exports = router;


