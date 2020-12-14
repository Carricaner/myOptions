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
				res.send({msg: "expire"});
			} else {
                res.send({msg: "valid", payload: authData.payload})
            }
        })
    } else {
        res.send({msg: "empty"})
    }
}
    





module.exports = {
    checkJWT
}