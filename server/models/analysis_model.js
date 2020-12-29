const { transPromise } = require("./mysql");

// 只取九十筆
const sqlGetStaticBigIndex = () => {
	return transPromise("SELECT * FROM ana_bigindex ORDER BY id DESC LIMIT 90;")
		.then(result => { return result.result; });
};

// 有兩個月的部位 => 只挑第一個月選
const sqlGetStaticOptDis = () => {
	return transPromise("SELECT * FROM ana_optdis WHERE duetime = (SELECT duetime FROM ana_optdis ORDER BY id ASC LIMIT 1);")
		.then(result => { return result.result; });
};

// 只取三十筆
const sqlGetStaticBigguyLeft = () => {
	return transPromise("SELECT * FROM ana_bigguyfs ORDER BY id DESC LIMIT 30;")
		.then(result => { return result.result; });
};


module.exports = {
	sqlGetStaticBigIndex,
	sqlGetStaticOptDis,
	sqlGetStaticBigguyLeft,
};