import PassportJWT from 'passport-jwt';
import passport from 'passport';
import User from '../models/user.model';

const JWT_SECRET = '$#GR24T4344$#$@#%WTEWTEAE%$6';
export const configureJWTStrtegy = () => {
    let opts = {};
    opts.jwtFromRequest = PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken();

    opts.secretOrKey = JWT_SECRET;

    passport.use(
        new PassportJWT.Strategy(opts, function(jwt_payload, done) {
            User.findOne({ id: jwt_payload.sub }, function(err, user) {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                    // or you could create a new account
                }
            });
        })
    );
};
