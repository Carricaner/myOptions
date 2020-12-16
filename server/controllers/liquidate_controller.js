const { 
    sqlGetUserMoneyLeft,
    sqlGetUnliquidatedParts,
    sqlUpdateMoneyLeftAfterLiquidation,
    sqlUpdateUserPartsAfterLiquidation
} = require('../models/liquidate_model')



const liquidateAllUserParts = (nowTarget) => {
    
    Promise.all([sqlGetUserMoneyLeft(), sqlGetUnliquidatedParts()])
    .then(result => {
        // console.log(result)
        let userMoneynProfit = result[0]
        let unliquidatedParts = result[1]
        let partsArray = []
        let moneyleftArray = []

        const distributePart = (part, nowTarget) => {
            let temp = {
                id: part.id,
                prod_dealprice: 0,
                prod_profit: 0,
            }
            if (part.prod_cp == "call") {
                if (Number(part.prod_target) < nowTarget) {
                    temp.prod_dealprice = nowTarget - Math.floor(Number(part.prod_target))
                }
                temp.prod_profit = Math.floor(temp.prod_dealprice * 50 - part.prod_promise)
            } else if (part.prod_cp == "put") {
                if (Number(part.prod_target) > nowTarget) {
                    temp.prod_dealprice = Math.floor(Number(part.prod_target) - nowTarget)
                }
                temp.prod_profit = Math.floor(temp.prod_dealprice * 50 - part.prod_promise)
            }
            return temp
        }

        async function liquidate(partsArray, moneyleftArray) {
            for (let i = 0; i < partsArray.length; i++) {
                let temp = [
                    partsArray[i].prod_dealprice,
                    partsArray[i].prod_profit,
                    partsArray[i].id
                ]
                await sqlUpdateUserPartsAfterLiquidation(temp)
            }
            for (let i = 0; i < moneyleftArray.length; i++) {
                let temp = [
                    moneyleftArray[i].moneyleft,
                    moneyleftArray[i].totalprofit,
                    moneyleftArray[i].user_id
                ]
                await sqlUpdateMoneyLeftAfterLiquidation(temp)
            }
        }

        for (let i = 0; i < unliquidatedParts.length; i++) {

            let userTemp = distributePart(unliquidatedParts[i], nowTarget)
            let userPromise =  Math.floor(Number(unliquidatedParts[i].prod_promise))

            if (moneyleftArray.length == 0) {
                let moneyTemp = {
                    user_id: unliquidatedParts[i].user_id,
                    moneyleft: userPromise + userTemp.prod_profit,
                    totalprofit: userTemp.prod_profit
                }
                moneyleftArray.push(moneyTemp)
            } else {
                let isNewUser = true
                for ( let j = 0; j < moneyleftArray.length; j++ ) {
                    if (unliquidatedParts[i].user_id == moneyleftArray[j].user_id) {
                        moneyleftArray[j].moneyleft += userPromise + userTemp.prod_profit
                        moneyleftArray[j].totalprofit += userTemp.prod_profit
                        isNewUser = false
                    }
                }
                if (isNewUser) {
                    let moneyTemp = {
                        user_id: unliquidatedParts[i].user_id,
                        moneyleft: userPromise + userTemp.prod_profit,
                        totalprofit: userTemp.prod_profit
                    }
                    moneyleftArray.push(moneyTemp)
                }
            }
            partsArray.push(userTemp)

        }

        for (let i = 0; i < userMoneynProfit.length; i++) {
            for (let j = 0; j < moneyleftArray.length; j++) {
                if (userMoneynProfit[i].user_id == moneyleftArray[j].user_id) {
                    moneyleftArray[j].moneyleft += userMoneynProfit[i].moneyleft
                    moneyleftArray[j].totalprofit += userMoneynProfit[i].totalprofit
                }
            }
        }

        // console.log(userMoneynProfit)
        // console.log(partsArray)
        // console.log(moneyleftArray)

        return liquidate(partsArray, moneyleftArray)
    })
    .then(() => {
        console.log("All users' parts are liquidated!")
    })
    
}


module.exports = {
    liquidateAllUserParts
}