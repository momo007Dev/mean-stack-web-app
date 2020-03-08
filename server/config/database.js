const mongoose = require('mongoose');
const host = process.env.DB_HOST;
const dbURL = `mongodb://${host}/web_app`;

//connect with the database
mongoose.connect(dbURL,
    {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,
        useFindAndModify : false})
    .then(() => {
        console.log(`Database connected successfully to ${dbURL}`);
    }).catch(err => {
    console.log(err);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
    console.log(`Mongoose connection error: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose  connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose connection disconnected through app termination');
        process.exit(0);
    });
});


