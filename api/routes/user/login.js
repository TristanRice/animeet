const express  = require("express")
    , jwt      = require("jsonwebtoken")
    , passport = require("passport")
    , request  = require("request");

const router = express.Router( );

const jwt_key = process.env.jwt_key || "w/5m~,XAyDL[gSn3";

router.post("/login", function(req, res, next) {
	passport.authenticate("local", { session: false }, function(err, user, info) {

		req.login(user, { session: false }, function(err) {
			if (err)
				throw err;

			if (!user)
				return res.json({"success": false, "msg": "Login failed"});

			const token = jwt.sign(user.toJSON(), jwt_key);

			return res.json({"success": true, "user": user, "token": token});
		});
	})(req, res, next);
});

module.exports = router;
