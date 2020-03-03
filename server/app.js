const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const path = require('path');

// Initialize the app
const app = express();

// Defining the PORT
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    return res.json({
        message : "This is node.js backend system"
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

