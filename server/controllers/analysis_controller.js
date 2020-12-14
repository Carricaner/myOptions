var moment = require('moment-timezone');

const { 
    sqlGetStaticBigIndex
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



module.exports = {
    getStaticBigIndex
}