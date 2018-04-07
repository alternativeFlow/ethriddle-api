import express from 'express';
import User from '../models/User';
import parseErrors from '../utils/parseErrors';
import { sendConfirmationEmail } from '../mailer';

const router = express.Router();

router.post('/', (req, res) => {
	const { account, nickname } = req.body.user;
	const user = new User({ account:account, nickname:nickname });
	user.save()
		.then(userRecord => {
			res.json({ user: userRecord.toAuthJSON() });
		})
		.catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});


export default router;