const express  = require("express")
	, jwt      = require("jsonwebtoken")
	, passport = require("passport")
	, router   = express.Router( );

router.get("/me", function(req, res, next) {
	passport.authenticate("jwt", { session: false }, function(err, user, info) {
		if (err) {
			return res.json({
				"success": false
			});
		}

		return res.json({
			"success": true,
			"user": user
		});
	})(req, res, next);
});

module.exports = router;