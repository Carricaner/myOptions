const { 
	getNowTime 
} = require("../../util/util_timezone");


const getBackEndTime = (req, res) => {
	try {
		res.send(getNowTime());
	} catch (excep) {
		res.send({msg: "fail"})
	}
};


module.exports = {
	getBackEndTime,
};