import time
import datetime
import threading
import pytz
from dateutil.relativedelta import relativedelta

    

def currentTimeGetter(timezone):
    # Choose Shanghai's time zone
    tz = pytz.timezone(timezone)
    curHr = datetime.datetime.now(tz).hour
    curMin = datetime.datetime.now(tz).minute
    curSec = datetime.datetime.now(tz).second
    return datetime.time(curHr, curMin, curSec)    


def currentDateGetter(timezone):
    # Choose Shanghai's time zone
    tz = pytz.timezone(timezone)
    today = datetime.datetime.now(tz)
    return today  


def getNowDayOfWeek(timezone):
    tz = pytz.timezone(timezone)
    today = datetime.datetime.now(tz)
    return today.date().weekday()


def getDateTimeProd(timezone):
    
    # add 0 if needed
    def addZeroIfNeeded(factor):
        if (len(str(factor)) < 2):
            return "0%s" %factor
        else:
            return str(factor)

    # current params
    curYear = currentDateGetter(timezone).year
    curMonth = currentDateGetter(timezone).month
    curDay = currentDateGetter(timezone).day
    curHour = currentTimeGetter(timezone).hour
    curMinute = currentTimeGetter(timezone).minute
    curSecond = currentTimeGetter(timezone).second
    
    curDateString = "%s-%s-%s" %(curYear, addZeroIfNeeded(curMonth), addZeroIfNeeded(curDay))
    curTimeString = "%s:%s:%s" %(addZeroIfNeeded(curHour), addZeroIfNeeded(curMinute), addZeroIfNeeded(curSecond))
    # print(curYear, curMonth, curDay, curHour, curMinute, curSecond)

    # nextmonth params
    dayAfterAMonth = currentDateGetter(timezone) + relativedelta(months=1)
    nextYear = dayAfterAMonth.year
    nextMonth = dayAfterAMonth.month
    nextDay = dayAfterAMonth.day
    nextHour = dayAfterAMonth.hour
    nextMinute = dayAfterAMonth.minute
    nextSecond = dayAfterAMonth.second

    nextDateString = "%s-%s-%s" %(nextYear, addZeroIfNeeded(nextMonth), addZeroIfNeeded(nextDay))
    nextTimeString = "%s:%s:%s" %(addZeroIfNeeded(nextHour), addZeroIfNeeded(nextMinute), addZeroIfNeeded(nextSecond))
    # print(nextYear, nextMonth, nextDay, nextHour, nextMinute, nextSecond)


    # 當月1號禮拜幾
    firstDayOfMonthInAWeek = datetime.datetime(curYear, curMonth, 1).date().weekday()

    # print(firstDayOfMonthInAWeek)

    if (firstDayOfMonthInAWeek < 3):
        dealDateOfTheMonth = 18 - firstDayOfMonthInAWeek - 1
    elif(firstDayOfMonthInAWeek >= 3):
        dealDateOfTheMonth = 25 - firstDayOfMonthInAWeek - 1

    # print(dealDateOfTheMonth)

    # 過了結算日的下午兩點
    isAfterDealDayTradeHours = curDay == dealDateOfTheMonth and curHour > 14
    isTheDaysAfterDealDay = curDay > dealDateOfTheMonth

    # print(isAfterDealDayTradeHours)
    # print(isTheDaysAfterDealDay)
    # print(isAfterDealDayTradeHours or isTheDaysAfterDealDay)

    if (isAfterDealDayTradeHours or isTheDaysAfterDealDay):
        return "%s%s" %(nextYear, addZeroIfNeeded(nextMonth)), curDateString, curTimeString
    else:
        return "%s%s" %(curYear, addZeroIfNeeded(curMonth)), curDateString, curTimeString


def time_in_range(start, end, x):
    """Return true if x is in the range [start, end]"""
    if start <= end:
        return start <= x <= end
    else:
        return start <= x or x <= end

