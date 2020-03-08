const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
require('dotenv').config();
require('./config/database');

// Initialize the app
const app = express();

// Defining the Middlewares
app.use(cors());

// set the static folder
app.use(express.static(path.join(__dirname, 'public')));

// BodyParser Midlleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// bring the passport auth strategy
require('./config/passport')(passport);

app.get('/', (req, res) => {
    return res.json({
        message: "This is node.js backend system"
    });
});

// Bring in the user routers
const users = require('./routes/users');
const questions = require('./routes/questions');
app.use('/api/users', users);
app.use('/api', questions);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const error = new Error("Not found !");
    error.status = 404;
    next(error);
});

// Error Handler
app.use((error, req, res) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

