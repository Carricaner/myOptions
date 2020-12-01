from selenium import webdriver
from selenium.webdriver.support.ui import Select
from bs4 import BeautifulSoup
import time
import datetime
import threading
import pytz
from dateutil.relativedelta import relativedelta


# ===== Inner Usage ======
from .mysql import updateSQL
from .htmlParser import parser4realtimeOpt, parser4realtimeBigIndex, parser4staticOptDis
from .timeManager import time_in_range, currentTimeGetter, getNowDayOfWeek, currentDateGetter
# ========================

# sample@
# optParams = {
#     'isDay': True,  #False => Night
#     'isheadless': True,
#     'headless_argu': ['--headless', '--disable-notifications'],

#     'startTime': datetime.time(9, 0, 0),
#     'endTime': datetime.time(13, 30, 0),
#     'curTime': currentTimeGetter('Asia/Shanghai'),
#     'dayOfWeek' : getNowDayOfWeek('Asia/Shanghai'),

#     'table' : 'realtime_opt',
#     'columns' : '(call_var, call_deal, call_sell, call_buy, target, put_buy, put_sell, put_deal, put_var)',
#     'items' : '(%s, %s, %s, %s, %s, %s, %s, %s, %s)'
# }


def realtimeOptCrawler(params):
    
    start = params['startTime']
    end = params['endTime']
    current = params['curTime']

    # choose day or night
    if (params['isDay']):
        # 選擇權日盤
        url = "https://mis.taifex.com.tw/futures/RegularSession/EquityIndices/Options/"  
    else:
        # 選擇權夜盤
        url = "https://mis.taifex.com.tw/futures/AfterHoursSession/EquityIndices/Options/"

    # distinguish day of weeks (0 => Mon; 6 => Sun)
    isWeekdays = params['dayOfWeek'] < 5

    # last trading hours on Saturday
    isLastTradeHours = (params['dayOfWeek'] == 5) and time_in_range(start, end, current)
    
    # 判斷開盤時間: 平日 or 禮拜六最後交易時段
    if (isWeekdays or isLastTradeHours):

        if (time_in_range(start, end, current)):
            
            # choose whether headless or not
            if ( params['isheadless'] ):
                option = webdriver.ChromeOptions()
                for item in params['headless_argu']:
                    option.add_argument(item)
                driver = webdriver.Chrome(options = option)
            else:
                driver = webdriver.Chrome()
            
            # get URL & click confirm button
            driver.get(url)
            time.sleep(2)
            confirmBtn = driver.find_element_by_css_selector("#content > main > div.container > div.approve-wrap > button:nth-child(2)")
            confirmBtn.click()
            time.sleep(2)

            for i in range(10):
                # deliver page-source to parse HTML
                page_source = driver.page_source
                listData = parser4realtimeOpt(page_source)

                #turn 2D list into 2D tuple
                tupleData = tuple(map(tuple, listData))

                #update SQL
                updateSQL(tupleData, params['table'], params['columns'], params['items'])
                # print(tupleData)
                # print()

                time.sleep(6)

            # Close window
            driver.quit() 

        else:
            print("Trading time is over... sleep for 2 mins")
            time.sleep(60*2)

    else: 
        print("It is weekend! Have a break!")
        time.sleep(60*30)




def realtimeBigIndexCrawler(params):
    
    start = params['startTime']
    end = params['endTime']
    current = params['curTime']

    # choose day or night
    if (params['isDay']):
        # 大盤日盤
        url = "https://mis.taifex.com.tw/futures/RegularSession/EquityIndices/FuturesDomestic/"  
    else:
        #台指期全(夜盤)
        url = "https://mis.taifex.com.tw/futures/AfterHoursSession/EquityIndices/FuturesDomestic/" 


    # distinguish day of weeks (0 => Mon; 6 => Sun)
    isWeekdays = params['dayOfWeek'] < 5

    # last trading hours on Saturday
    isLastTradeHours = (params['dayOfWeek'] == 5) and time_in_range(start, end, current)
    
    # 判斷開盤時間: 平日 or 禮拜六最後交易時段
    if (isWeekdays or isLastTradeHours):

        if (time_in_range(start, end, current)):

            # choose whether headless or not
            if ( params['isheadless'] ):
                option = webdriver.ChromeOptions()
                for item in params['headless_argu']:
                    option.add_argument(item)
                driver = webdriver.Chrome(options = option)
            else:
                driver = webdriver.Chrome()

            # get URL & click confirm button
            driver.get(url)
            time.sleep(2)
            refreshBtn = driver.find_element_by_css_selector("#content > main > div.container > div.approve-wrap > button:nth-child(2)")
            refreshBtn.click()
            time.sleep(2)


            for i in range(10):
                # deliver page-source to parse HTML
                page_source = driver.page_source
                listData = parser4realtimeBigIndex(page_source)

                #turn 2D list into 2D tuple
                tupleData = tuple(map(tuple, listData))

                #update SQL
                updateSQL(tupleData, params['table'], params['columns'], params['items'])
                # print(tupleData)
                # print()

                time.sleep(6)

            # Close window
            driver.quit() 

        else:
            print("Trading time is over... sleep for 2 mins")
            time.sleep(60*2)

    else: 
        print("It is weekend! Have a break!")
        time.sleep(60*30)





def staticOptDisCrawler():

    # distinguish day of weeks (0 => Mon; 6 => Sun)
    isWeekdays = getNowDayOfWeek('Asia/Shanghai') < 5

    # set crawling time
    startCollectTime = datetime.time(3, 30, 0)
    endCollectTime =  datetime.time(23, 35, 0)
    curTime = currentTimeGetter('Asia/Shanghai')

    # current date
    curYear = currentDateGetter('Asia/Shanghai').year
    curMonth = currentDateGetter('Asia/Shanghai').month
    curDay = currentDateGetter('Asia/Shanghai').day

    # next Month the same day
    dayAfterAMonth = currentDateGetter('Asia/Shanghai') + relativedelta(months=1)
    nextYear = dayAfterAMonth.year
    nextMonth = dayAfterAMonth.month
    nextDay = dayAfterAMonth.day


    # url
    url = "https://www.taifex.com.tw/cht/3/optDailyMarketReport"

    if (isWeekdays and time_in_range(startCollectTime, endCollectTime, curTime)):
        
        # use headless mode or not
        option = webdriver.ChromeOptions()
        option.add_argument('--headless')
        option.add_argument('--disable-notifications')
        driver = webdriver.Chrome(options = option)
        # driver = webdriver.Chrome()

        # get URL, select desired options and click confirm button
        driver.get(url)
        time.sleep(2)
        dateInput = driver.find_element_by_css_selector("#queryDate")
        dateInput.clear()
        dateInput.send_keys("%d/%d/%d" %(curYear, curMonth, curDay))

        tradeTimeSelect = Select(driver.find_element_by_css_selector("#MarketCode"))
        tradeTimeSelect.select_by_value("0")

        contractSelect = Select(driver.find_element_by_css_selector("#commodity_idt"))
        contractSelect.select_by_value("TXO")

        queryBtn = driver.find_element_by_css_selector("#button")
        queryBtn.click()

        time.sleep(6)

        
        # deliver page-source to parse HTML
        page_source = driver.page_source
        listData = parser4staticOptDis(page_source, curYear, curMonth, curDay, nextYear, nextMonth)
        
        #turn 2D list into 2D tuple
        tupleData = tuple(map(tuple, listData))
        # print(tupleData)

        #update SQL
        updateSQL(tupleData, 
            "ana_optdis", 
            '(date, contract, duetime, target, cp, finalprice, dealprice, pricevar, amountinday, amountleft)', 
            '(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'
        )

        time.sleep(5)

        # Close window
        driver.quit()

    else:
        print("Static crawler is pending ... \nWait for %d:%d on weekdays to start" %(startCollectTime.hour, startCollectTime.minute))
        time.sleep(60*15)




