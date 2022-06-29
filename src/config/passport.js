const ObjectId = require("mongodb").ObjectId
    // const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const User = require("../../models/user")
module.exports = function(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' },
        async function(username, password, done) {

            try {
                const user = await User.get(username);
                if (!user) {
                    return done(null, false, { message: "Incorrect username or/and password." });
                }
                if (user.isLocked) {
                    return done(null, false, { message: "Account has been locked." })
                }
                if (user.role) {
                    return done(null, false, { message: "User not found or/and authorized." })
                }
                const isPasswordValid = await User.passwordValid(username, password);
                if (!isPasswordValid) {
                    return done(null, false, { message: "Incorrect username or/and password." });
                }
                return done(null, user);
            } catch (ex) {
                return done(ex);
            }
        }
    ));


    passport.serializeUser(function(user, done) {
        // done(null, user.email);
        done(null, user._id)
    });

    passport.deserializeUser(async function(userId, done) {

        // const user = await User.get(email);
        const id = new ObjectId(userId)
        const user = await User.detail(id)

        // console.log(typeof id, '\n\n', user)
        done(undefined, user);
    });
}