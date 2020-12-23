const router = require('express').Router();

const { getIndex } = require('../controllers/realtime_controller')



router.route('/realtime/getIndex')
.get(getIndex);



module.exports = router;