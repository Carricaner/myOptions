const router = require('express').Router();

const { 
    checkJWT
} = require('../controllers/auth_controller')



router.route('/auth/checkJWT')
.post(checkJWT)






module.exports = router;