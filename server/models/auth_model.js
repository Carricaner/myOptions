const { transPromise } = require("./mysql");


const sqlGetUserWithEmail = (email, localorfb) => {
	return transPromise(`SELECT * FROM users WHERE email = '${email}' AND localorfb = '${localorfb}';`)
		.then(result => { return result.result; });
};


const sqlInsertUser = (user) => {
	return transPromise("INSERT INTO users SET ?;", user)
		.then(result => { return result; });
};


const sqlCreateANewMoneyLeft = (user) => {
	return transPromise("INSERT INTO moneynprofit SET ?;", user)
		.then(result => { return result; });
};



module.exports = {
	sqlGetUserWithEmail,
	sqlInsertUser,
	sqlCreateANewMoneyLeft,
};