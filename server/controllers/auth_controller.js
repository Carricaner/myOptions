require("dotenv").config();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { 
	token_secret,
	token_expireIn,
} = process.env;

const {
	filterSpecialNotation,
} = require("../../util/util_regexp");

const {
	sqlGetUserWithEmail,
	sqlInsertUser,
	sqlCreateANewMoneyLeft,
} = require("../models/auth_model");


const checkJWT = (req, res) => {
	const token = req.body.token.split(" ")[1];
	if (token) {
		jwt.verify(token, token_secret, (err, authData) => {
			if (err) {
				res.send({msg: "expire"});
			} else {
				res.send({msg: "valid", payload: authData.payload});
			}
		});
	} else {
		res.send({msg: "empty"});
	}
};
    

const checkSignUp = (req, res) => {
	const email = filterSpecialNotation(req.body.email);
	const password = filterSpecialNotation(req.body.password);
	const hash = crypto.createHash("sha256");

	sqlGetUserWithEmail(email, "local")
		.then(result => {
			if (!result[0]) {

				const container = {
					email: email,
					password: hash.update(password).digest("hex"),
					localorfb: "local",
				};
				return sqlInsertUser(container);
			} else {
				return {msg: "failure"};
			}
		})
		.then(result => {
			if (result.insertId) {

				// create a account
				const moneyContainer = {
					user_id: result.insertId,
					moneyleft: 100000,
				};
				sqlCreateANewMoneyLeft(moneyContainer);
            
				const payload = {
					userId: result.insertId,
					email: email,
				};
				let expiration = Number(token_expireIn);
				jwt.sign(
					{payload},
					token_secret,
					{expiresIn: `${expiration}s`},
					(err, token) => {
						const sent = {
							msg: "success",
							token: token
						};
						res.send(sent);
					});
			} else {
				res.send({msg: "fail"});
			}
		});
};


const checkSignIn = (req, res) => {
	const email = filterSpecialNotation(req.body.email);
	const password = filterSpecialNotation(req.body.password);
	const hash = crypto.createHash("sha256");
	const passwordAfterHex = hash.update(password).digest("hex");

	sqlGetUserWithEmail(email, "local")
		.then(result => {
			if (result[0]) {
				if (result[0].email == email && result[0].password == passwordAfterHex) {
					const payload = {
						userId: result[0].id,
						email: result[0].email,
					};
					let expiration = Number(token_expireIn);
					jwt.sign(
						{payload},
						token_secret,
						{expiresIn: `${expiration}s`},
						(err, token) => {
							const sent = {
								msg: "success",
								token: token
							};
							res.send(sent);
						});
				} else {
					res.send({msg: "wrongPassword"});
				}
			} else {
				res.send({msg: "invalidEmail"});
			}
		});

};



module.exports = {
	checkJWT,
	checkSignUp,
	checkSignIn,
};