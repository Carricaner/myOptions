const router = require("express").Router();

const { 
	buyParts,
	showUserParts,
	updateUserPartsnMoneyLeft,
	showUserMoneyLeftnTotalprofit,
} = require("../controllers/trade_controller");


router.route("/trade/buyParts")
	.post(buyParts);


router.route("/trade/showUserParts")
	.post(showUserParts);


router.route("/trade/liquidateParts")
	.post(updateUserPartsnMoneyLeft);


router.route("/trade/showUserMoneyLeftnTotalprofit")
	.post(showUserMoneyLeftnTotalprofit);



module.exports = router;