const router = require("express").Router();

const { 
	getBackEndTime,
} = require("../controllers/time_controller");


router.route("/time/getBackEndTime")
	.get(getBackEndTime);



module.exports = router;