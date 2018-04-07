import nodemailer from 'nodemailer';

const from ='"EthRiddle" <info@EthRiddle.com>';


function setup() {

	return nodemailer.createTransport({
	  host: process.env.EMAIL_HOST,
	  port: process.env.EMAIL_PORT,
	  auth: {
	    user: process.env.EMAIL_USER,
	    pass: process.env.EMAIL_PASS
	  }
	});
}

export function sendConfirmationEmail(user) {
	const transport = setup();
	const email = {
		from,
		to: user.email,
		subject: "Welcome to EthRiddle",
		text: `
		Welcome to EthRiddle. Please confirm your email.

		${user.generateConfirmationUrl()}
		`
	};
	transport.sendMail(email);
}

export function sendResetPasswordEmail(user) {
	const transport = setup();
	const email = {
		from,
		to: user.email,
		subject: `Reset Password`,
		text: `Please follow link to reset password:

		${user.generateResetPasswordLink()}
		`
	};
	transport.sendMail(email);
}