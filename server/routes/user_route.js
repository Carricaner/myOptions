const router = require("express").Router();

const { 
	checkSignIn,
	checkSignUp
} = require("../controllers/user_controller");



router.route("/user/signIn")
	.post(checkSignIn);


router.route("/user/signUp")
	.post(checkSignUp);



module.exports = router;