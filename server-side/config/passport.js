const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/users');


// to auth the user by JWT Startegy
module.exports = (passport) => {

    // At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("JWT");
    opts.secretOrKey = process.env.JWT_KEY;

    // The JWT payload is passed into the verify callback
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        //console.log(jwt_payload);

        // assign the `userId` property on the JWT to the database ID of user
        User.findById(jwt_payload.userId, (err, user) => {

            //console.log(err);
            if(err) return done(err, false);

            // here, the JWT is valid and the user is valid, so we are authorized!
            if(user) return done(null, user);
            return done(null, false);
        });
    }));
};
