import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';
//TODO: add uniqueness and email validations to email field
const schema = new mongoose.Schema({
	account: {type: String, required: true, unique: true},
	nickname: { type: String, required: true, unique: true }
}, { timestamps: true });


// schema.methods.setConfirmationToken = function setConfirmationToken() {
// 	this.confirmationToken = this.generateJWT();
// }

// schema.methods.generateConfirmationUrl = function generateConfirmationUrl() {
// 	return `${process.env.HOST}/confirmation/${this.confirmationToken}`;
// }

// schema.methods.generateResetPasswordLink = function generateResetPasswordLink() {
// 	return `${process.env.HOST}/reset_password/${this.generateResetPasswordToken()}`;
// }

schema.methods.generateJWT = function generateJWT() {
	return jwt.sign(
		{
			_id: this._id,
			account: this.account,
			email: this.email,
			confirmed: this.confirmed
		}, 
		process.env.SECRET_KEY
	);
};

// schema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
// 	return jwt.sign(
// 		{
// 			_id: this._id
// 		}, 
// 		"secretkey",
// 		{ expiresIn: "1h" }
// 	);
// };

schema.methods.toAuthJSON = function toAuthJSON() {
	return {
		_id: this._id,
		account: this.account,
		email: this.email,
		nickname: this.nickname,
		confirmed: this.confirmed,
		token: this.generateJWT()
	}
};

schema.plugin(uniqueValidator, {message: 'This email is already taken'});

export default mongoose.model('User', schema);