const router = require('express').Router();

const { 
    getBackEndTime,
    buyParts,
    showUserParts,
    updateUserPartsnMoneyLeft,
    showUserMoneyLeftnTotalprofit,
} = require('../controllers/trade_controller')


router.route('/user/getBackEndTime')
.get(getBackEndTime)


router.route('/user/buyParts')
.post(buyParts)


router.route('/user/showUserParts')
.post(showUserParts)


router.route('/user/liquidateParts')
.post(updateUserPartsnMoneyLeft)


router.route('/user/showUserMoneyLeftnTotalprofit')
.post(showUserMoneyLeftnTotalprofit)



module.exports = router;