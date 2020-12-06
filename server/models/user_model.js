const { transPromise } = require("./mysql")


const sqlGetUserMoneyLeft = () => {
    return transPromise('SELECT * FROM moneynprofit')
    .then(result => {return result.result})
}


const sqlUpdateUserMoneyLeft = (change) => {
    return transPromise('Update moneynprofit SET moneyleft = ?, totalprofit = ? WHERE id = ?', change)
    .then(result => {return result})
}


const sqlAddUserParts = (userPart) => {
    return transPromise('INSERT INTO userspart SET ?', userPart)
    .then(result => {return result})
}


const sqlGetUserParts = (userId) => {
    return transPromise(`SELECT * FROM userspart WHERE user_id = ${userId}`)
    .then(result => {return result.result})
}


module.exports = {
    sqlGetUserMoneyLeft,
    sqlAddUserParts,
    sqlUpdateUserMoneyLeft,
    sqlGetUserParts
}