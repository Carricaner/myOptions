const { transPromise } = require("./mysql")


const sqlGetStaticBigIndex = () => {
    return transPromise('SELECT * FROM ana_bigindex')
    .then(result => {return result.result})
}


module.exports = {
    sqlGetStaticBigIndex
}