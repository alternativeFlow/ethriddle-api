import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import Promise from 'bluebird';
var socket = require('socket.io');
var cors = require('cors');

import auth from './routes/auth';
import users from './routes/users';
import riddles from './routes/riddles';
import chat from './routes/chat';

var corsOptions = {
	origin: 'https://ethriddle-react.herokuapp.com/'
}

app.use(cors(corsOptions));

dotenv.config();
const app = express();
app.use(bodyParser.json());
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URL);

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/riddles", riddles);
app.use("/api/chat", chat);

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

var server = app.listen(process.env.PORT||8080, () => console.log('Running on localhost:8080'));

var io = socket(server);
io.on('connection', (socket) => {
	// console.log(socket.id);

	socket.on('SEND_MESSAGE', function(data) {
		io.emit('RECEIVED_MESSAGE', data);
	})
})