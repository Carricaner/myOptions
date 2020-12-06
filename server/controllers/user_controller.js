const { 
    sqlGetUserMoneyLeft,
    sqlAddUserParts,
    sqlUpdateUserMoneyLeft,
    sqlGetUserParts
 } = require('../models/user_model')


const buyParts = (req, res) => {
    const { act, cost, cp, month, number, target, token } = req.body
    let moneynprofitId = 0
    let moneyLeft = 0
    let moneySpent = 0

    // 使用者部分還沒有添加 先指定一位
    sqlGetUserMoneyLeft()
    .then(result => {
        moneySpent = cost * number * 50
        moneynprofitId = result[0].id
        moneyLeft = result[0].moneyleft

        if (moneySpent < moneyLeft) { // logical的部分記得加手續費
            let userPart = {
                user_id: 38,
                prod_target: target,
                prod_act: act,
                prod_month: month,
                prod_cp: cp,
                prod_number: number,
                prod_cost: cost,
                prod_promise: moneySpent,
                prod_dealprice: 0,
                prod_profit: 0,
            }
            sqlAddUserParts(userPart)
            return {msg: 'success'}
        } else {
            return {msg: 'fail'}
        }
    })
    .then(result => {
        if (result.msg == 'success') {
            sqlUpdateUserMoneyLeft([moneyLeft-moneySpent, 0, moneynprofitId])
        }
        res.send(result)
    })
}


// const showUserParts = (req, res) => {
//     const { token } = req.body

//     sqlGetUserParts()
//     .then(result => {

//     })
// }


module.exports = {
    buyParts
}