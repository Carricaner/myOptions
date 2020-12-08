const { 
    sqlGetUserMoneyLeft,
    sqlGetSpecificUserMoneyLeft,
    sqlAddUserParts,
    sqlDeductUserMoneyLeft,
    sqlUpdateUserMoneyLeft,
    sqlGetUserLeftParts,
    sqlUpdateUserParts
 } = require('../models/trade_model')


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
                prod_dealprice: null,
                prod_profit: null,
            }
            sqlAddUserParts(userPart)
            return {msg: 'success'}
        } else {
            return {msg: 'fail'}
        }
    })
    .then(result => {
        if (result.msg == 'success') {
            sqlDeductUserMoneyLeft([moneyLeft-moneySpent, moneynprofitId])
        }
        res.send(result)
    })
}


const showUserParts = (req, res) => {
    // const { token } = req.body

    // 假設這邊有使用者為id = 38
    sqlGetUserLeftParts(38)
    .then(result => {
        res.send(result)
    })

}


const updateUserPartsnMoneyLeft = (req, res) => {
    const { id, userId, nowPrice, profit } = req.body

    sqlGetSpecificUserMoneyLeft(userId)
    .then(result => {
        let moneyLeft = result[0].moneyleft + profit
        let totalprofit = result[0].totalprofit + profit
        let moneyLeftId = result[0].id

        let updateUserPart = sqlUpdateUserParts([nowPrice, profit, id])
        let updateMoneyLeft = sqlUpdateUserMoneyLeft([moneyLeft, totalprofit, moneyLeftId])
        return Promise.all([updateUserPart, updateMoneyLeft])
    })
    .then(result => {
        console.log(result)
        res.send({msg: "success"})
    })

}


const showUserMoneyLeftnTotalprofit = (req, res) => {
    const { token } = req.body
    
    // 先指定userId
    sqlGetSpecificUserMoneyLeft(38)
    .then(result => {
        let userValue = {
            moneyLeft: result[0].moneyleft,
            totalprofit: result[0].totalprofit
        }
        res.send(userValue)
    })

}




module.exports = {
    buyParts,
    showUserParts,
    updateUserPartsnMoneyLeft,
    showUserMoneyLeftnTotalprofit
}