const router = require('express').Router();

const { buyParts } = require('../controllers/user_controller')



router.route('/user/buyParts')
.post(buyParts)







module.exports = router;