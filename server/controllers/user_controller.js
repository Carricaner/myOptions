require('dotenv').config();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { 
    token_secret,
    token_expireIn,
} = process.env;

const {
    sqlGetUserWithSpecificEmail,
    sqlInsertUser,
    sqlCreateANewMoneyLeft,
 } = require('../models/user_model')


const checkSignUp = (req, res) => {
    let { email, password } = req.body
    const hash = crypto.createHash("sha256");

    // Hash password
    let container = {
        email: email,
        password: hash.update(password).digest("hex"),
        localorfb: "local",
    }

    let moneyContainer = {
        user_id: null,
        moneyleft: 100000,
    }

    sqlGetUserWithSpecificEmail(email, 'local')
    .then(result => {
        if (!result[0]) {

            return sqlInsertUser(container)
        } else {
            return {msg: 'failure'}
        }
    })
    .then(result => {
        if (result.insertId) {
            // create an new account
            moneyContainer.user_id = result.insertId
            sqlCreateANewMoneyLeft(moneyContainer)
            
            const payload = {
                userId: result.insertId,
                email: email,
            }
            let expiration = Number(token_expireIn)
			jwt.sign(
                {payload},
                token_secret,
                {expiresIn: `${expiration}s`},
                (err, token) => {
                    const sent = {
                        msg: 'success',
                        token: token
                    }
                    res.send(sent)
            })
        } else {
            res.send({msg: 'fail'})
        }
    })
}


const checkSignIn = (req, res) => {
    let { email, password } = req.body
    const hash = crypto.createHash("sha256")
    let passwordAfterHex = hash.update(password).digest("hex")

    sqlGetUserWithSpecificEmail(email, 'local')
    .then(result => {
        if (result[0]) {
            if (result[0].email == email && result[0].password == passwordAfterHex) {
                const payload = {
                    userId: result[0].id,
                    email: result[0].email,
                }
                let expiration = Number(token_expireIn)
                jwt.sign(
                    {payload},
                    token_secret,
                    {expiresIn: `${expiration}s`},
                    (err, token) => {
                        const sent = {
                            msg: 'success',
                            token: token
                        }
                        res.send(sent)
                })
            } else {
                res.send(sent = {msg: 'wrongPassword'})
            }
        } else {
            res.send(sent = {msg: 'invalidEmail'})
        }
    })

}



module.exports = {
    checkSignIn,
    checkSignUp,
}