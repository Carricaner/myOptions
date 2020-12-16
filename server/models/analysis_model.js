const { transPromise } = require("./mysql")


const sqlGetStaticBigIndex = () => {
    return transPromise('SELECT * FROM ana_bigindex')
    .then(result => {return result.result})
}


const sqlGetStaticOptDis = () => {
    return transPromise('SELECT * FROM ana_optdis')
    .then(result => {return result.result})
}

// 只取三十筆
const sqlGetStaticBigguyLeft = () => {
    return transPromise('SELECT * FROM ana_bigguyfs ORDER BY id DESC LIMIT 30')
    .then(result => {return result.result})
}


module.exports = {
    sqlGetStaticBigIndex,
    sqlGetStaticOptDis,
    sqlGetStaticBigguyLeft,
}