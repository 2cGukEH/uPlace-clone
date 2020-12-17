import passport from "passport";
import GithubStrategy from "passport-github";
import GoogleStrategy from "passport-google-oauth20";
import {
    githubLoginCallback,
    googleLoginCallback,
} from "./controllers/userController";
import User from "./models/User";
import routes from "./routes";

passport.use(User.createStrategy());

passport.use(
    new GithubStrategy({
            clientID: process.env.GH_ID,
            clientSecret: process.env.GH_SECRET,
            callbackURL: process.env.PRODUCTION ?
                `https://polar-sea-27980.herokuapp.com${routes.githubCallback}` : `http://localhost:4000${routes.githubCallback}`
        },
        githubLoginCallback
    )
);

passport.use(
    new GoogleStrategy({
            clientID: process.env.GG_ID,
            clientSecret: process.env.GG_SECRET,
            callbackURL: process.env.PRODUCTION ?
                `https://enigmatic-spire-78020.herokuapp.com${routes.googleCallback}` : `http://localhost:4000${routes.googleCallback}`,
        },
        googleLoginCallback
    )
);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());