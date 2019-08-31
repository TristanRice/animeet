const passport      = require("passport")
    , passportJWT   = require("passport-jwt")
    , LocalStrategy = require("passport-local").Strategy
    , User          = require("./models/user")
    , ExtractJWT    = passportJWT.ExtractJwt
    , JWTStrategy   = passportJWT.Strategy;

const jwt_key = process.env.jwt_key || "w/5m~,XAyDL[gSn3";


passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({ "username": username }, function(err, user) {
			if (err)
				return done(err);

			if (!user)
				return done(null, false, {
					"message": "Incorrect username"
				});

			if (!user.verify_password(password))
				return done(null, false, {
					"message": "Incorrect password"
				});

			return done(null, user);
		});
	}
));

passport.use(new JWTStrategy({
		jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
		secretOrKey: jwt_key
	},
	function(jwtPayload, done) {
		return User.findOne({ "username": jwtPayload.username }, function(err, user) {
			if (err)
				return done(err);

			return done(null, user);
		})
	}
));
