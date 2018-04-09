import express from 'express';
import mongoose from 'mongoose';
import Riddle from '../models/Riddle';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import parseErrors from '../utils/parseErrors';

const router = express.Router();

router.get('/', (req, res) => {
	Riddle.find({ active: true })
		.sort({"_id": -1})
		.populate('owner')
		.then(riddles => {
			res.json({ riddles: riddles });
		})
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.post("/get_all_user_riddles", (req, res) => {
	jwt.verify(req.body.token, process.env.SECRET_KEY, (err, decoded) => {
		if (err) {
			res.status(401).json({});
		}
		else {
			Riddle.find({ owner: decoded._id })
				.sort({"_id": -1})
				.populate('owner')
				.then(riddles => {
					res.json({ riddles: riddles });
				})
				.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
		}
	});
});

router.post('/create_riddle', (req, res) => {
	const { token, title, riddle, answer, payoutAmt, guessCost } = req.body.data;	
		try {
			jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
				if (err) {
					res.status(401).json({});
				}
				else {
					var ownerId = mongoose.Types.ObjectId(decoded._id);
					const newRiddle = new Riddle({owner: ownerId, title:title, riddle:riddle, guessCost:guessCost, payoutAmt:payoutAmt, active:false, hasPaidOut:false, hasCancelled:false});
					newRiddle.save()
						.then(riddleRecord => {
							res.json({riddle: riddleRecord});
						})
						.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
				}
			});
		}
		catch(e) {
			return res.status(401).send('unauthorized');
		}
});
//Update activity
router.post('/update_riddle_activity', (req, res) => {
	const { id, currentContractActivity } = req.body;
	console.log(id);
	Riddle.findOneAndUpdate({_id: id}, {active: currentContractActivity})
		.populate('owner')
		.then(riddle => {
			res.json({riddle: riddle});
		})
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
})

export default router;