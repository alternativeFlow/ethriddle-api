import mongoose from 'mongoose';

var Schema = mongoose.Schema;

const schema = new mongoose.Schema({
	sender: {type: Schema.ObjectId, ref: 'User', required: true},
	message: {type: String, required: true}
}, { timestamps: true });

schema.methods.toJson = function toJson() {
	return {
		sender: this.sender,
		message: this.message
	}
}

export default mongoose.model('Chat', schema);