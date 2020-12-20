const { 
    sqlGetUser,
    sqlGetOneUserHistoricParts,
    sqlGetOtherUserHistoricParts,
} = require('../models/profile_model')


const getUserInfo = (req, res) => {
    const { userId } = req.body

    sqlGetUser(userId)
    .then(result => {
        res.send(result)
    })

}

const analyzeUserHistoricParts = (req, res) => {
    const { userId } = req.body

    Promise.all(
        [
            sqlGetOneUserHistoricParts(userId),
            sqlGetOtherUserHistoricParts(userId)
        ]
    )
    .then(result => {
        let userTimes = result[0].length
        let otherTimes = result[1].length
        let callTimes = 0
        let putTimes = 0
        let userToalCost = 0
        let otherToalCost = 0
        let userToalPromise = 0
        let otherToalPromise = 0
        let highProfitArray = []
        let totalProfit = 0
        let winTimes = 0
        
        result[0].forEach(trade => {

            if(Number(trade.prod_profit) > 0) {
                winTimes += 1
            }

            totalProfit += Number(trade.prod_profit)
            
            if (highProfitArray.length == 0) {
                highProfitArray.push(Number(trade.prod_profit))
            } else if (Number(trade.prod_profit) > highProfitArray[0]) {
                highProfitArray.pop()
                highProfitArray.push(Number(trade.prod_profit))
            }
            
            if (trade.prod_cp == 'call') {
                callTimes += 1
            } else {
                putTimes += 1
            }

            userToalCost += Number(trade.prod_cost)
            userToalPromise += Number(trade.prod_promise)
        })
        
        result[1].forEach(trade => {
            otherToalCost += Number(trade.prod_cost)
            otherToalPromise += Number(trade.prod_promise)
        }) 

        let carton = {
            highest: highProfitArray[0],
            averageProfit: totalProfit / result[0].length,
            winRate:  Number((winTimes / result[0].length).toFixed(2)),
            tradeTimes: result[0].length,
            callTimes: callTimes,
            putTimes: putTimes,
            aveUserSeries: [
                Number((userToalCost / userTimes).toFixed(2)),
                Number((userToalPromise / userTimes).toFixed(2)),
            ],
            aveOtherSeries: [
                Number((otherToalCost / otherTimes).toFixed(2)),
                Number((otherToalPromise / otherTimes).toFixed(2))
            ],
        }

        res.send(carton)
    })

}

module.exports = {
    getUserInfo,
    analyzeUserHistoricParts
}