from selenium import webdriver
from selenium.webdriver.support.ui import Select
from bs4 import BeautifulSoup
import time
import datetime
import threading
import pytz
from dateutil.relativedelta import relativedelta
import redis
import json


# ===== Inner Usage ======
from .mysql import updateSQL, flushSQL
from .htmlParser import parser4realtimeOpt, parser4realtimeBigIndex, parser4staticOptDis, parser4staticBigguyLeft, parser4staticBigIndex
from .timeManager import time_in_range, currentTimeGetter, getNowDayOfWeek, currentDateGetter, getDateTimeProd
# ===== Redis Setting ======
cacheRedis = redis.Redis(host='localhost', port=6379, decode_responses=True)
# ========================


def realtimeOptCrawler(params):

    # choose day or night
    if (params['isDay']):
        # 選擇權日盤
        url = "https://mis.taifex.com.tw/futures/RegularSession/EquityIndices/Options/"  
    elif (params['isNight']):
        # 選擇權夜盤
        url = "https://mis.taifex.com.tw/futures/AfterHoursSession/EquityIndices/Options/"

    # distinguish day of weeks (0 => Mon; 6 => Sun)
    isWeekdays = params['dayOfWeek'] < 5

    # last trading hours on Saturday
    isLastTradeHours = (params['dayOfWeek'] == 5) and params['isNight']
    
    # 判斷開盤日期: 平日 or 禮拜六最後交易時段
    if (isWeekdays or isLastTradeHours):

        # 判斷開盤時間
        if (params['isDay'] or params['isNight']):
            
            # choose whether headless or not
            if ( params['isheadless'] ):
                option = webdriver.ChromeOptions()
                option.add_argument('--headless')
                option.add_argument('--disable-notifications')
                driver = webdriver.Chrome(options = option)
            else:
                driver = webdriver.Chrome()
            
            # get URL & click confirm button
            driver.get(url)
            time.sleep(2)
            confirmBtn = driver.find_element_by_css_selector("#content > main > div.container > div.approve-wrap > button:nth-child(2)")
            confirmBtn.click()
            time.sleep(2)
            productSelect = Select(driver.find_element_by_css_selector("#content > main > div.container > div.row.no-gutters.pb-2 > div.col-12.col-md > form > div:nth-child(2) > div > select"))
            productSelect.select_by_value(getDateTimeProd('Asia/Shanghai')[0])
            time.sleep(5)

            for i in range(params['crawlHTMLTimes']):
                # deliver page-source to parse HTML
                page_source = driver.page_source
                data = parser4realtimeOpt(page_source)
                updateData = {
                    "date" : getDateTimeProd('Asia/Shanghai')[1],
                    "time" : getDateTimeProd('Asia/Shanghai')[2],
                    "product": getDateTimeProd('Asia/Shanghai')[0],
                    "data" : data,
                }
                # update Redis
                cacheRedis.set("realtimeOpt", json.dumps(updateData))
                print("<%s %s> Redis is updated." %(getDateTimeProd('Asia/Shanghai')[1], getDateTimeProd('Asia/Shanghai')[2]))

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
    
    # choose day or night
    if (params['isDay']):
        # 大盤日盤
        url = "https://mis.taifex.com.tw/futures/RegularSession/EquityIndices/FuturesDomestic/"  
    elif (params['isNight']):
        #台指期全(夜盤)
        url = "https://mis.taifex.com.tw/futures/AfterHoursSession/EquityIndices/FuturesDomestic/" 


    # distinguish day of weeks (0 => Mon; 6 => Sun)
    isWeekdays = params['dayOfWeek'] < 5

    # last trading hours on Saturday
    isLastTradeHours = (params['dayOfWeek'] == 5) and params['isNight']
    
    # 判斷開盤日期: 平日 or 禮拜六最後交易時段
    if (isWeekdays or isLastTradeHours):

        # 判斷開盤時間
        if (params['isDay'] or params['isNight']):

            # choose whether headless or not
            if ( params['isheadless'] ):
                option = webdriver.ChromeOptions()
                option.add_argument('--headless')
                option.add_argument('--disable-notifications')
                driver = webdriver.Chrome(options = option)
            else:
                driver = webdriver.Chrome()

            # get URL & click confirm button
            driver.get(url)
            time.sleep(2)
            refreshBtn = driver.find_element_by_css_selector("#content > main > div.container > div.approve-wrap > button:nth-child(2)")
            refreshBtn.click()
            time.sleep(2)
            productSelect = Select(driver.find_element_by_css_selector("#content > main > div.container > div.row.no-gutters.pb-2 > div.col-12.col-md > form > div:nth-child(1) > div > select"))
            productSelect.select_by_value("TXF")
            time.sleep(5)

            for i in range(params['crawlHTMLTimes']):
                # deliver page-source to parse HTML
                page_source = driver.page_source
                data = parser4realtimeBigIndex(page_source)
                updateData = {
                    "date" : getDateTimeProd('Asia/Shanghai')[1],
                    "time" : getDateTimeProd('Asia/Shanghai')[2],
                    "data" : data,
                }
                # update Redis
                cacheRedis.set("realtimeBigIndex", json.dumps(updateData))
                print("<%s %s> Redis is updated." %(getDateTimeProd('Asia/Shanghai')[1], getDateTimeProd('Asia/Shanghai')[2]))

                time.sleep(6)

            # Close window
            driver.quit() 

        else:
            print("Trading time is over... sleep for 2 mins")
            time.sleep(60*2)

    else: 
        print("It is weekend! Have a break!")
        time.sleep(60*30)


def staticOptDisCrawler(params):

    # add 0 if needed
    def addZeroIfNeeded(factor):
        if (len(str(factor)) < 2):
            return "0%s" %factor
        else:
            return str(factor)

    # distinguish day of weeks (0 => Mon; 6 => Sun)
    isWeekdays = getNowDayOfWeek('Asia/Shanghai') < 5

    # current time
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

    if (isWeekdays and time_in_range(params['startCollectTime'], params['endCollectTime'], curTime)):
        
        # choose whether headless or not
        if ( params['isheadless'] ):
            option = webdriver.ChromeOptions()
            option.add_argument('--headless')
            option.add_argument('--disable-notifications')
            driver = webdriver.Chrome(options = option)
        else:
            driver = webdriver.Chrome()

        # get URL, select desired options and click confirm button
        driver.get(url)
        time.sleep(2)
        dateInput = driver.find_element_by_css_selector("#queryDate")
        dateInput.clear()
        dateInput.send_keys("%s/%s/%s" %(curYear, addZeroIfNeeded(curMonth), addZeroIfNeeded(curDay)))   
        time.sleep(2)

        try:

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
                '(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
                True
            )

            time.sleep(5)

            # Close window
            driver.quit()

        except:
            # Close window
            driver.quit()
            print("Today is holiday! No need to crawl anything, hava a nice break!")
            time.sleep(60*15)

    else:
        print("Not crawling time... sleep for 15 mins.")
        time.sleep(60*15)


def staticBigguyLeftCrawler(params):  #e.g. "2020/11/25"

    # add 0 if needed
    def addZeroIfNeeded(factor):
        if (len(str(factor)) < 2):
            return "0%s" %factor
        else:
            return str(factor)

    # distinguish day of weeks (0 => Mon; 6 => Sun)
    isWeekdays = getNowDayOfWeek('Asia/Shanghai') < 5

    # current time
    curTime = currentTimeGetter('Asia/Shanghai')

    # current date
    curYear = currentDateGetter('Asia/Shanghai').year
    curMonth = currentDateGetter('Asia/Shanghai').month
    curDay = currentDateGetter('Asia/Shanghai').day

    # url
    url = "https://www.taifex.com.tw/cht/3/futContractsDate"

    if (isWeekdays and time_in_range(params['startCollectTime'], params['endCollectTime'], curTime)):
        
        # choose whether headless or not
        if ( params['isheadless'] ):
            option = webdriver.ChromeOptions()
            option.add_argument('--headless')
            option.add_argument('--disable-notifications')
            driver = webdriver.Chrome(options = option)
        else:
            driver = webdriver.Chrome()

        # get URL, select desired options and click confirm button
        driver.get(url)
        time.sleep(3)

        dateInput = driver.find_element_by_css_selector("#queryDate")
        dateInput.clear()
        todayString = "%s/%s/%s" %(curYear, addZeroIfNeeded(curMonth), addZeroIfNeeded(curDay))

        contractSelect = Select(driver.find_element_by_css_selector("#commodityId"))
        contractSelect.select_by_value("TXF")

        if (params['isUpdateMode']):
            print("Update Mode Choosen.")
            dateInput.send_keys(todayString)
            queryBtn = driver.find_element_by_css_selector("#button")
            queryBtn.click()
            time.sleep(5)

            page_source = driver.page_source
            try:
                tableTeller = driver.find_element_by_css_selector("#printhere > div:nth-child(4) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(4) > td:nth-child(4) > div:nth-child(1) > font")
                print("The page is crawlable.")
                data = parser4staticBigguyLeft(page_source, todayString)
                #turn 2D list into 2D tuple
                tupleData = tuple(map(tuple, data))
                print(tupleData)
                print("\n")

                #update SQL
                updateSQL(
                    tupleData, 
                    "ana_bigguyfs", 
                    '(date, identity, trade_m_num, trade_m_money, trade_l_num, trade_l_money, trade_t_num, trade_t_money, left_m_num, left_m_money, left_l_num, left_l_money, left_t_num, left_t_money)', 
                    '(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
                    False
                )

                time.sleep(5)
                # Close window
                driver.quit()

            except:
                # Close window
                driver.quit()
                print("Today is special holiday, no need to crawl anything!")
                time.sleep(60*15)


        else:
            print("History Mode Choosen.")
            dateInput.send_keys(params['fromWhichDay'])

            queryBtn = driver.find_element_by_css_selector("#button")
            queryBtn.click()


            time.sleep(5)

            isSthLeftToCrawled = True

            while (isSthLeftToCrawled):
                
                try:
                    dateInput = driver.find_element_by_css_selector("#queryDate")
                    dateStringInTheCurrentPage = dateInput.get_attribute("value").strip()

                    page_source = driver.page_source

                    if (dateStringInTheCurrentPage == todayString):
                        print("It is the last page.")
                        #crawl the page
                        data = parser4staticBigguyLeft(page_source, dateStringInTheCurrentPage)
                        tupleData = tuple(map(tuple, data))
                        # print(tupleData)
                        # print("\n")

                        #update SQL
                        updateSQL(
                            tupleData, 
                            "ana_bigguyfs", 
                            '(date, identity, trade_m_num, trade_m_money, trade_l_num, trade_l_money, trade_t_num, trade_t_money, left_m_num, left_m_money, left_l_num, left_l_money, left_t_num, left_t_money)', 
                            '(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
                            False
                        )

                        isSthLeftToCrawled = False
                    else:
                        #flushall SQL data once only
                        if (dateStringInTheCurrentPage == params['fromWhichDay']):
                            flushSQL("ana_bigguyfs")

                        try:
                            tableTeller = driver.find_element_by_css_selector("#printhere > div:nth-child(4) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(4) > td:nth-child(4) > div:nth-child(1) > font")
                            print("The page is crawlable.")
                            #crawl the page
                            data = parser4staticBigguyLeft(page_source, dateStringInTheCurrentPage)
                            tupleData = tuple(map(tuple, data))
                            # print(tupleData)
                            # print("\n")

                            #update SQL
                            updateSQL(
                                tupleData, 
                                "ana_bigguyfs", 
                                '(date, identity, trade_m_num, trade_m_money, trade_l_num, trade_l_money, trade_t_num, trade_t_money, left_m_num, left_m_money, left_l_num, left_l_money, left_t_num, left_t_money)', 
                                '(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
                                False
                            )

                            nextPageBtn = driver.find_element_by_css_selector("#button4")
                            nextPageBtn.click()
                            time.sleep(5)

                        except:

                            nextPageBtn = driver.find_element_by_css_selector("#button4")
                            nextPageBtn.click()
                            time.sleep(5)
                
                except:
                    print("Today's data is not available. Closing the browser.")
                    isSthLeftToCrawled = False


            time.sleep(3)

            # Close window
            driver.quit()    
    else:
        print("Not crawling time... sleep for 15 mins.")
        time.sleep(60*15)


def staticBigIndexCrawler(params):
    
    # add 0 if needed
    def addZeroIfNeeded(factor):
        if (len(str(factor)) < 2):
            return "0%s" %factor
        else:
            return str(factor)

    # distinguish day of weeks (0 => Mon; 6 => Sun)
    isWeekdays = getNowDayOfWeek('Asia/Shanghai') < 5

    # current time
    curTime = currentTimeGetter('Asia/Shanghai')

    # current date
    curYear = currentDateGetter('Asia/Shanghai').year
    curMonth = currentDateGetter('Asia/Shanghai').month
    curDay = currentDateGetter('Asia/Shanghai').day

    # the same day a year ago
    dayAYearAgo = currentDateGetter('Asia/Shanghai') - relativedelta(years=1)
    previousYear = dayAYearAgo.year
    previousMonth = dayAYearAgo.month
    previousDay = dayAYearAgo.day

    # url
    url = "https://www.twse.com.tw/zh/page/trading/indices/MI_5MINS_HIST.html"

    # print(previousYear)
    # print(previousMonth)
    # print(previousDay)

    if (isWeekdays and time_in_range(params['startCollectTime'], params['endCollectTime'], curTime)):
        
        # choose whether headless or not
        if ( params['isheadless'] ):
            option = webdriver.ChromeOptions()
            option.add_argument('--headless')
            option.add_argument('--disable-notifications')
            driver = webdriver.Chrome(options = option)
        else:
            driver = webdriver.Chrome()

        # get URL
        driver.get(url)
        time.sleep(3)

        yearInput = Select(driver.find_element_by_css_selector("#d1 > select:nth-child(1)"))
        yearInput.select_by_value("%s" %previousYear)  
        time.sleep(3)
    
        for i in range(12):  

            time.sleep(2)
            monthSelect = Select(driver.find_element_by_css_selector("#d1 > select:nth-child(2)"))
            monthSelect.select_by_value("%s" %(i+1))
            time.sleep(2)
            
            queryByn = driver.find_element_by_css_selector("#main-form > div > div > form > a")
            queryByn.click()
            time.sleep(3)

            print("Year: %s Month: %s Crawled." %(curYear, i+1))
            page_source = driver.page_source
            data = parser4staticBigIndex(page_source)

            tupleData = tuple(map(tuple, data))

            #update SQL
            if (i == 0):
                flushSQL("ana_bigindex")

            updateSQL(
                tupleData, 
                "ana_bigindex", 
                '(date, open, high, low, close)', 
                '(%s, %s, %s, %s, %s)',
                False
            )

        time.sleep(5)
        yearInput = Select(driver.find_element_by_css_selector("#d1 > select:nth-child(1)"))
        yearInput.select_by_value("%s" %curYear)  
        time.sleep(3)

        for i in range(curMonth):  

            time.sleep(2)
            monthSelect = Select(driver.find_element_by_css_selector("#d1 > select:nth-child(2)"))
            monthSelect.select_by_value("%s" %(i+1))
            time.sleep(2)
            
            queryByn = driver.find_element_by_css_selector("#main-form > div > div > form > a")
            queryByn.click()
            time.sleep(3)

            print("Year: %s Month: %s Crawled." %(curYear, i+1))
            page_source = driver.page_source
            data = parser4staticBigIndex(page_source)

            tupleData = tuple(map(tuple, data))
            # print(tupleData)
            # print("\n")

            #update SQL
            updateSQL(
                tupleData, 
                "ana_bigindex", 
                '(date, open, high, low, close)', 
                '(%s, %s, %s, %s, %s)',
                False
            )

        # Close window
        driver.quit()
        
    else:
        print("Not crawling time... sleep for 15 mins.")
        time.sleep(60*15)

        



            
            


            

            