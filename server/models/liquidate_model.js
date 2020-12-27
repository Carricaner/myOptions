const { transPromise } = require("./mysql")


const sqlGetUserMoneyLeft = () => {
    return transPromise('SELECT * FROM moneynprofit;')
    .then(result => {return result.result})
}


const sqlGetUnliquidatedParts = () => {
    return transPromise('SELECT * FROM userspart WHERE prod_dealprice IS NULL;')
    .then(result => {return result.result})
}


const sqlUpdateMoneyLeftAfterLiquidation = (change) => {
    return transPromise('Update moneynprofit SET moneyleft = ?, totalprofit = ? WHERE user_id = ?;', change)
    .then(result => {return result})
}


const sqlUpdateUserPartsAfterLiquidation = (change) => {
    return transPromise('UPDATE userspart SET prod_dealprice = ?, prod_profit = ? WHERE id = ?;', change)
    .then(result => {return result})
}



module.exports = {
    sqlGetUserMoneyLeft,
    sqlGetUnliquidatedParts,
    sqlUpdateMoneyLeftAfterLiquidation,
    sqlUpdateUserPartsAfterLiquidation,
}