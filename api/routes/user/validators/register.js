const { checkSchema } = require("express-validator/check")
    , validator       = require("validator")

const register_validation = checkSchema({
	username: {
		escape: true,
		isLength: {
			options: { min: 3, max: 15},
			errorMessage: "Username must be between 3 and 15 characters long"
		},
		custom: {
			options: (username, { req }) => {
				const re = /^[a-z0-9]+$/i;
				if (username && !username.match(re))
					throw new Error("Username must be alphanumeric");

				return true;
			}
		},
		trim: true
	},

	email: {
    isEmail: true
	},

	password: {
		custom: {
			options: (password, { req }) => {
				re =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*_(=)])(?=.{8,})/
				if (!password.match(re))
					throw new Error("Your password must contain a lowercase letter, an uppercase letter, a number, and a special character");

				const password2 = req.body.password2;
				if (!password2 || password !== password2)
					throw new Error("Passwords must match");

				return true;
			}
		}
	}
});


module.exports = register_validation;
