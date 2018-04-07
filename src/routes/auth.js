import express from 'express';
import jwt from "jsonwebtoken";
import User from '../models/User';
import { sendResetPasswordEmail } from '../mailer'

const router = express.Router();

router.post('/', (req, res) => {
	const { signature } = req.body;
	console.log(signature);
	User.findOne({ account: signature }).then(user => {
		if (user) {
			res.json({user: user.toAuthJSON()});
		}
		else {
			res.status(400).json({ errors: { global: "Invalid credentials"}});
		}
	});
});

router.post('/confirmation', (req, res) => {
	const token = req.body.token;
	User.findOneAndUpdate(
		{ confirmationToken: token }, 
		{ confirmationToken: "", confirmed: true }, 
		{ new: true }
	).then(user => 
		user ? res.json({ user: user.toAuthJSON() }) : res.status(400).json({})
	);
});

router.post("/reset_password_request", (req, res) => {
	User.findOne({ email: req.body.email }).then(user => {
		if (user) {
			sendResetPasswordEmail(user);
			res.json({});
		}
		else {
			res.status(400).json({ errors: { global: "There is no user with given email"}})
		}
	});
});

router.post("/validate_token", (req, res) => {
	jwt.verify(req.body.token, "secretkey", err => {
		if (err) {
			res.status(401).json({});
		}
		else {
			res.json({});
		}
	});
});

// router.post("/reset_password", (req, res) => {
// 	const {password, token} = req.body.data;
// 	jwt.verify(token, "secretkey", (err,decoded) =>{ 
// 		if (err){
// 			res.status(401).json( { errors: {global: "Invalid token"}});
// 		}
// 		else {
// 			User.findOne({ _id: decoded._id}).then(user => {
// 				if (user) {
// 					user.setPassword(password);
// 					user.save().then(() => res.json({}));
// 				}
// 				else {
// 					res.status(404).json({errors:{global:"Invalid token"}});
// 				}
// 			})
// 		}
// 	});
// });


export default router;