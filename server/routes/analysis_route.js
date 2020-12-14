const router = require('express').Router();

const { getStaticBigIndex } = require('../controllers/analysis_controller')


router.route('/analysis/getStaticBigIndex')
.get(getStaticBigIndex);







module.exports = router;