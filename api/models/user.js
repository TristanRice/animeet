const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const User = new mongoose.Schema({
	username: {unique: true, type: String},
	email: {unique: true, type: String},
	password: String,
	preferences: {
		dark_mode: Boolean,
		dull_mode: Boolean
	},
	fav_animes: {
		{
			name: String,
		}
	},
	biography: String,
	profile_picture: String,
	gender: String,
	date_of_birth: String,
	sexual_preferences: {
		//true for each one that they want to date
		men: Boolean,
		women: Boolean,
		non_binary: Boolean
	}

}, {timestamps: true});

User.methods.hash_password = function( ) {
	this.password = bcrypt.hashSync(this.password, 5);
}

User.methods.verify_password = function(password) {
	return bcrypt.compareSync(password, this.password);
}

User.plugin(uniqueValidator);

module.exports = mongoose.model("User", User);
