import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

var Schema = mongoose.Schema;

const schema = new mongoose.Schema({
	owner: { type: Schema.ObjectId, ref: 'User', required: true },
	title: { type: String, required: true },
	riddle: { type: String, required: true, index: true },
	guessCost: { type: Number, required: true },
	payoutAmt: { type: Number, required: true },
	active: { type: Boolean, default: false },
	hasPaidOut: { type: Boolean, default: false },
	hasCancelled:  { type: Boolean, default: false }
}, { timestamps: true });


schema.methods.toJson = function toJson() {
	return {
		title: this.title,
		riddle: this.riddle,
		guessCost: this.guessCost,
		payoutAmt: this.payoutAmt,
		active: this.active
	}
}
schema.plugin(uniqueValidator, {message: 'This riddle is already taken'});

export default mongoose.model('Riddle', schema);