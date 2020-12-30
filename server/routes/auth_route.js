const router = require("express").Router();

const { 
	checkJWT,
	checkSignIn,
	checkSignUp,
} = require("../controllers/auth_controller");


router.route("/auth/checkJWT")
	.post(checkJWT);


router.route("/user/signIn")
	.post(checkSignIn);


router.route("/user/signUp")
	.post(checkSignUp);



module.exports = router;