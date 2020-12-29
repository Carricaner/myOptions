const router = require("express").Router();

const { 
	getStaticBigIndex,
	getStaticOptDis,
	getStaticBigguyLeft,
} = require("../controllers/analysis_controller");


router.route("/analysis/getStaticBigIndex")
	.get(getStaticBigIndex);


router.route("/analysis/getStaticOptDis")
	.get(getStaticOptDis);


router.route("/analysis/getStaticBigguyLeft")
	.get(getStaticBigguyLeft);


module.exports = router;