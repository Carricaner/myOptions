// get rid of special notaion ("@ , -" are not included!)
const filterSpecialNotation = (str) => {
	var pattern = new RegExp("[`~!#$^&*()=|{}‘:;‘,\\[\\]<>/?~！#￥……&*（）——|{}【】‘；：”“‘。，、？%+_]");
	var afterStr = "";
	for(var i = 0; i < str.length; i++) {
		afterStr += str.substr(i, 1).replace(pattern, ``); 
	}
	return afterStr;
};


module.exports = {
	filterSpecialNotation,
};