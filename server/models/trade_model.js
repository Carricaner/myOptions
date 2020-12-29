const { transPromise } = require("./mysql");


const sqlGetUserMoneyLeft = () => {
	return transPromise("SELECT * FROM moneynprofit;")
		.then(result => { return result.result; });
};


const sqlGetSpecificUserMoneyLeft = (userId) => {
	return transPromise(`SELECT * FROM moneynprofit WHERE user_id = ${userId};`)
		.then(result => { return result.result; });
};


const sqlDeductUserMoneyLeft = (change) => {
	return transPromise("Update moneynprofit SET moneyleft = ? WHERE id = ?;", change)
		.then(result => { return result; });
};


const sqlUpdateUserMoneyLeft = (change) => {
	return transPromise("Update moneynprofit SET moneyleft = ?, totalprofit = ? WHERE id = ?;", change)
		.then(result => { return result; });
};


const sqlAddUserParts = (userPart) => {
	return transPromise("INSERT INTO userspart SET ?;", userPart)
		.then(result => { return result; });
};


const sqlGetUserLeftParts = (userId) => {
	return transPromise(`SELECT * FROM userspart WHERE user_id = ${userId} AND prod_dealprice IS NULL;`)
		.then(result => { return result.result; });
};


const sqlUpdateUserParts = (change) => {
	return transPromise("UPDATE userspart SET prod_dealprice = ?, prod_profit = ? WHERE id = ?;", change)
		.then(result => { return result; });
};



module.exports = {
	sqlGetUserMoneyLeft,
	sqlGetSpecificUserMoneyLeft,
	sqlAddUserParts,
	sqlDeductUserMoneyLeft,
	sqlUpdateUserMoneyLeft,
	sqlGetUserLeftParts,
	sqlUpdateUserParts
};