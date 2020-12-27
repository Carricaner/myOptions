const { transPromise } = require("./mysql")


const sqlGetUser = (lookupArray) => {
    let lookupString = ``
    for (let i = 0; i < lookupArray.length; i++) {
        if (i == lookupArray.length - 1) {
            lookupString += `${lookupArray[i]}`
        } else {
            lookupString += `${lookupArray[i]}, `
        }
    }
    return transPromise(`SELECT ${lookupString} FROM users;`)
    .then(result => {return result.result})
}


const sqlGetUserWithSpecificEmail = (email, localorfb) => {
    return transPromise(`SELECT * FROM users WHERE email = '${email}' AND localorfb = '${localorfb}';`)
    .then(result => {return result.result})
}


const sqlInsertUser = (user) => {
    return transPromise('INSERT INTO users SET ?;', user)
    .then(result => {return result})
}


const sqlCreateANewMoneyLeft = (user) => {
    return transPromise('INSERT INTO moneynprofit SET ?;', user)
    .then(result => {return result})
}




module.exports = {
    sqlGetUser,
    sqlGetUserWithSpecificEmail,
    sqlInsertUser,
    sqlCreateANewMoneyLeft,
}