import express from 'express';
import mongoose from 'mongoose';
import Chat from '../models/Chat';
import jwt from 'jsonwebtoken';
import parseErrors from '../utils/parseErrors';

const router = express.Router();

router.get('/', (req, res) => {
	Chat.find()
		.sort({"_id": -1})
		.limit(50)
		.populate('sender')
		.then(chat => {
			res.json({chat: chat});
		})
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.post('/add_message', (req, res) => {
	const message = req.body.data.message;
	const token = req.body.data.token;
	//verify token, extract data, add message to chat database
	var id;
	jwt.verify(token, "secretkey", (err,decoded) =>{ 
		if (err){
			res.status(401).json( { errors: {global: "Invalid token"}});
		}
		else {
			id = mongoose.Types.ObjectId(decoded._id);
		}
	});

	const chatInput = new Chat({sender:id, message: message});
	chatInput.save()
		.then(chatInput =>{
			console.log(chatInput);
			res.json({chat:chatInput})
		})
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));


});

export default router;