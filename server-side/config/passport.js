const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/users');

// to auth the user by JWT Startegy
module.exports = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("JWT");
    opts.secretOrKey = process.env.JWT_KEY;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        //console.log(jwt_payload);
        User.findById(jwt_payload.userId, (err, user) => {
            console.log(err);
            if(err) return done(err, false);
            if(user) return done(null, user);
            return done(null, false);
        });
    }));
};
