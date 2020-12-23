const { 
    sqlGetUserMoneyLeft,
    sqlGetSpecificUserMoneyLeft,
    sqlAddUserParts,
    sqlDeductUserMoneyLeft,
    sqlUpdateUserMoneyLeft,
    sqlGetUserLeftParts,
    sqlUpdateUserParts
} = require('../models/trade_model')


const { 
    getNowTime 
} = require("../../util/util_timezone")



const getBackEndTime = (req, res) => {
    res.send(getNowTime())
}


const buyParts = (req, res) => {
    const { act, cost, cp, month, number, target, userId } = req.body
    let moneynprofitId = 0
    let moneyLeft = 0
    let moneySpent = 0

    sqlGetSpecificUserMoneyLeft(userId)
    .then(result => {
        moneySpent = cost * number * 50
        moneynprofitId = result[0].id
        moneyLeft = result[0].moneyleft

        if (moneySpent < moneyLeft) { 
            let userPart = {
                user_id: userId,
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
    const { userId } = req.body

    sqlGetUserLeftParts(userId)
    .then(result => {
        res.send(result)
    })

}


const updateUserPartsnMoneyLeft = (req, res) => {
    const { partId, userId, number, nowPrice, profit } = req.body

    sqlGetSpecificUserMoneyLeft(userId)
    .then(result => {
        let moneyLeft = result[0].moneyleft + nowPrice * 50 * number
        let totalprofit = result[0].totalprofit + profit
        let moneyLeftId = result[0].id

        let updateUserPart = sqlUpdateUserParts([nowPrice, profit, partId])
        let updateMoneyLeft = sqlUpdateUserMoneyLeft([moneyLeft, totalprofit, moneyLeftId])
        return Promise.all([updateUserPart, updateMoneyLeft])
    })
    .then(result => {
        console.log(result)
        res.send({msg: "success"})
    })

}


const showUserMoneyLeftnTotalprofit = (req, res) => {
    const { userId } = req.body
    
    sqlGetSpecificUserMoneyLeft(userId)
    .then(result => {
        let userValue = {
            moneyLeft: result[0].moneyleft,
            totalprofit: result[0].totalprofit
        }
        res.send(userValue)
    })

}




module.exports = {
    getBackEndTime,
    buyParts,
    showUserParts,
    updateUserPartsnMoneyLeft,
    showUserMoneyLeftnTotalprofit
}