const { 
	sqlGetSpecificUserMoneyLeft,
	sqlAddUserParts,
	sqlDeductUserMoneyLeft,
	sqlUpdateUserMoneyLeft,
	sqlGetUserLeftParts,
	sqlUpdateUserParts
} = require("../models/trade_model");


const buyParts = (req, res) => {
	
	try {
		const { 
			act,
			cost, 
			cp, 
			month, 
			number, 
			target, 
			userId 
		} = req.body;

		sqlGetSpecificUserMoneyLeft(userId)
			.then(result => {
				const moneySpent = cost * number * 50;
				const moneynprofitId = result[0].id;
				const moneyLeft = result[0].moneyleft;

				if (moneySpent < moneyLeft) { 
					let userPart = {
						user_id: userId,
						prod_target: target,
						prod_act: act,
						prod_month: month,
						prod_cp: cp,
						prod_number: number,
						prod_cost: cost,
						prod_promise: moneySpent,
						prod_dealprice: null,
						prod_profit: null,
					};
					sqlAddUserParts(userPart);
					sqlDeductUserMoneyLeft([moneyLeft-moneySpent, moneynprofitId]);
					res.send({msg: "success"});
				} else {
					res.send({msg: "notEnough"});
				}
			})
			.catch(() => {
				throw new Error();
			});

	} catch (excep) {
		res.send({msg: "error"});
	}
	
};


const showUserParts = (req, res) => {
	const { userId } = req.body;

	sqlGetUserLeftParts(userId)
		.then(result => {
			res.send(result);
		});

};


const updateUserPartsnMoneyLeft = (req, res) => {
	try {
		const { 
			partId, 
			userId, 
			number, 
			nowPrice, 
			profit 
		} = req.body;
	
		sqlGetSpecificUserMoneyLeft(userId)
			.then(result => {
				const moneyLeft = result[0].moneyleft + nowPrice * 50 * number;
				const totalprofit = result[0].totalprofit + profit;
				const moneyLeftId = result[0].id;
	
				const updateUserPart = sqlUpdateUserParts([nowPrice, profit, partId]);
				const updateMoneyLeft = sqlUpdateUserMoneyLeft([moneyLeft, totalprofit, moneyLeftId]);
				return Promise.all([updateUserPart, updateMoneyLeft]);
			})
			.then(() => {
				res.send({msg: "success"});
			})
			.catch(() => {
				throw new Error();
			});
	} catch (excep) {
		res.send({msg: "fail"});
	}
};


const showUserMoneyLeftnTotalprofit = (req, res) => {
	const { userId } = req.body;
    
	sqlGetSpecificUserMoneyLeft(userId)
		.then(result => {
			let userValue = {
				moneyLeft: result[0].moneyleft,
				totalprofit: result[0].totalprofit
			};
			res.send(userValue);
		});

};



module.exports = {
	buyParts,
	showUserParts,
	updateUserPartsnMoneyLeft,
	showUserMoneyLeftnTotalprofit
};