const router = require("express").Router();

const { 
	getUserInfo,
	analyzeUserHistoricParts,
} = require("../controllers/profile_controller");


router.route("/profile/getUserInfo")
	.post(getUserInfo);


router.route("/profile/analyzeUserHistoricParts")
	.post(analyzeUserHistoricParts);



module.exports = router;