const router = require('express').Router();

const { 
    checkSignIn,
    checkSignUp
} = require('../controllers/user_controller')



router.route('/user/signIn')
.post(checkSignIn)


router.route('/user/signUp')
.post(checkSignUp)


// function hereHAHA(req, res, next) {
    
//     if (false) {
//         console.log(1231233)
//         next()
//     } else {
//         // res.redirect('../../../signin.html')  會成功
//     }

// }


// function test(req, res) {
//     res.send("awdawdawdawd")
// }


module.exports = router;