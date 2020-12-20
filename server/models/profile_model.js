const { transPromise } = require("./mysql")


const sqlGetUser = (userId) => {
    return transPromise(`SELECT id, email, created_at, pic FROM users WHERE id = ${userId}`)
    .then(result => {return result.result})
}

const sqlGetOneUserHistoricParts = (userId) => {
    return transPromise(`SELECT * FROM userspart WHERE user_id = ${userId} AND prod_dealprice IS NOT NULL`)
    .then(result => {return result.result})
}

const sqlGetOtherUserHistoricParts = (userId) => {
    return transPromise(`SELECT * FROM userspart WHERE user_id != ${userId} AND prod_dealprice IS NOT NULL`)
    .then(result => {return result.result})
}


module.exports = {
    sqlGetUser,
    sqlGetOneUserHistoricParts,
    sqlGetOtherUserHistoricParts,
}