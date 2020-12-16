var moment = require('moment-timezone');

const { 
    sqlGetStaticBigIndex,
    sqlGetStaticOptDis,
    sqlGetStaticBigguyLeft,
} = require('../models/analysis_model')



const getStaticBigIndex = (req, res) => {

    sqlGetStaticBigIndex()
    .then(result => {
        
        let dataSeries = []
        for (let i = 0; i < result.length; i++) {
            let tempArray = []
            let strArray = result[i].date.split("/")
            let newString = `${Number(strArray[0])+1911}-${strArray[1]}-${strArray[2]} 00:00:00`
            let timestamp = moment.tz(newString, "Asia/Taipei")
            let realx = timestamp.valueOf() + 28800000
            tempArray.push(realx)
            tempArray.push(Number(result[i].open))
            tempArray.push(Number(result[i].high))
            tempArray.push(Number(result[i].low))
            tempArray.push(Number(result[i].close))
            dataSeries.push(tempArray)
        }

        res.send({dataSeries})
    })

}

const getStaticOptDis = (req, res) => {

    sqlGetStaticOptDis()
    .then(result => {
        let container = {
            date: 0,
            targetArray: [],
            callArray: [],
            putArray: [],
        }
        for (let i = 0; i < result.length; i++) {
            if (container.date == 0) {
                container.date = result[i].date
            }
            if (!container.targetArray.includes(Number(result[i].target))) {
                container.targetArray.push(Number(result[i].target))
            }
            if (result[i].cp == 'Call') {
                let callLeft = Math.floor(Number(result[i].amountleft))
                if (Number(result[i].amountleft) != 0) {
                    container.callArray.push(-callLeft)
                } else {
                    container.callArray.push(callLeft)
                }
            } else if (result[i].cp == 'Put') {
                container.putArray.push(Math.floor(Number(result[i].amountleft)))
            }

        }
        res.send(container)
    })
}

const getStaticBigguyLeft = (req, res) => {

    sqlGetStaticBigguyLeft()
    .then(result => {
        let container = {
            dateArray: [],
            foreignArray: [],
            selfArray: [],
            throwArray: [],
            foreignCostArray: [],
            selfCostArray: [],
            throwCostArray: [],
        }
        for (let i = 0; i < result.length; i++) {
            if (!container.dateArray.includes(result[i].date)) {
                container.dateArray.push(result[i].date)
            }
            if (result[i].identity == "自營商") {
                container.selfArray.push(result[i].left_t_num)
                container.selfCostArray.push(result[i].left_t_money / result[i].left_t_num * 1000 / 200)
            } else if (result[i].identity == "投信") {
                container.throwArray.push(result[i].left_t_num)
                container.throwCostArray.push(result[i].left_t_money / result[i].left_t_num * 1000 / 200)
            } else if (result[i].identity == "外資") {
                container.foreignArray.push(result[i].left_t_num)
                container.foreignCostArray.push(result[i].left_t_money / result[i].left_t_num * 1000 / 200)
            }
        }
        res.send(container)
    })
}





module.exports = {
    getStaticBigIndex,
    getStaticOptDis,
    getStaticBigguyLeft,
}