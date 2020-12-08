require('dotenv').config();
const jwt = require("jsonwebtoken");

const { 
    token_secret,
} = process.env;

const checkJWT = (req, res) => {
    const token = req.body.token.split(" ")[1]
    if (token) {
        jwt.verify(token, token_secret, (err, authData) => {
			if (err) {
				res.send({msg: "The token is expired or invalid. Please re-login to access your user information."});
			} else {
                res.send({msg: "valid", payload: authData.payload})
            }
        })
    } else {
        res.send({msg: "Token missing.. redirect to sign-in page."})
    }
}
    





module.exports = {
    checkJWT
}