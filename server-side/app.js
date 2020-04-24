const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const {success, info, error, debug} = require('consola');
require('dotenv').config();
require('./config/database');

// Initialize the app
const app = express();

// Defining the Middlewares
app.use(cors());

// set the static folder
if (process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, 'public/dist')));
}


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
const reviews = require('./routes/reviews');
const users = require('./routes/users');
const questions = require('./routes/questions');

app.use('/server/api/', users);
app.use('/server/api/', questions);
app.use('/server/api/', reviews);
app.use('/server/api/docs', (req, res) => {
    res.sendFile(path.join(__dirname + '../../docs/index.html'));
});

app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/dist/index.html'));
});

app.listen(process.env.PORT, () => {
    info({message: `Server started on port ${process.env.PORT}`, badge: true})
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const error = new Error("Page Not found !");
    error.status = 404;
    next(error.message);
});

// Error Handler
app.use((error, req, res) => {
    //console.log(res.locals.error);
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});

