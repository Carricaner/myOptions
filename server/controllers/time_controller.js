const { 
	getNowTime 
} = require("../../util/util_timezone");


const getBackEndTime = (req, res) => {
	res.send(getNowTime());
};


module.exports = {
	getBackEndTime,
};