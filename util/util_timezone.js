const { normalizeUnits } = require('moment-timezone');
var moment = require('moment-timezone');


function getNowTime() {
    let TWtime = moment().tz("Asia/Taipei");

    let nowInMilliSec = TWtime.valueOf()
    let nowYear =  Number(TWtime.format('YYYY'))
    let nowMonth =  Number(TWtime.format('MM'))
    let nowDay =  Number(TWtime.format('DD'))
    let nowHour =  Number(TWtime.format('HH'))
    let nowMinute =  Number(TWtime.format('mm'))
    let nowSecond =  Number(TWtime.format('ss'))

    let now = new Date(nowInMilliSec)
    let dayOpenTime = new Date(nowYear, nowMonth-1, nowDay, 8, 47, 0)
    let dayCloseTime = new Date(nowYear, nowMonth-1, nowDay, 13, 45, 0)
    let nightOpenTime = new Date(nowYear, nowMonth-1, nowDay, 15, 2, 0)
    let nightCloseTime = new Date(nowYear, nowMonth-1, nowDay, 5, 0, 0)
    let openAfterDayCleanTime = new Date(nowYear, nowMonth-1, nowDay, 14, 30, 0)
    let closeAfterDayCleanTime = new Date(nowYear, nowMonth-1, nowDay, 14, 32, 0)
    let openAfterNightCleanTime = new Date(nowYear, nowMonth-1, nowDay, 6, 20, 0)
    let closeAfterNightCleanTime = new Date(nowYear, nowMonth-1, nowDay, 6, 22, 0)

    let TWtimeParams = {
        nowInMilliSec: nowInMilliSec + 28800000, // add 8h to be Taipei time
        nowYear: nowYear,
        nowMonth: nowMonth,
        nowDay: nowDay,
        nowHour: nowHour, 
        nowMinute: nowMinute, 
        nowSecond: nowSecond, 
        isDay : dayOpenTime < now && now < dayCloseTime,
        isNight : nightOpenTime < now || now < nightCloseTime,
        isafterDayCleanTime: openAfterDayCleanTime < now && now < closeAfterDayCleanTime,
        isafterNightCleanTime: openAfterNightCleanTime < now && now < closeAfterNightCleanTime,
    }
    return TWtimeParams
}
module.exports = {
    getNowTime
}