from selenium import webdriver
from bs4 import BeautifulSoup
import time
import datetime
import threading
import pytz

# ===== Inner Usage ======
from .mysql import updateSQL
from .htmlParser import parser4realtimeOpt, parser4realtimeBigIndex
from .timeManager import time_in_range
# ========================

# sample@
# optParams = {
#     'isDay': True,  #False => Night
#     'isheadless': True,
#     'headless_argu': ['--headless', '--disable-notifications'],
#     'startTime': datetime.time(11, 0, 0),
#     'endTime': datetime.time(23, 0, 0),
#     'curTime': currentTimeGetter('Asia/Shanghai'),
#     'table' : 'realtime_opt',
#     'columns' : '(call_var, call_deal, call_sell, call_buy, target, put_buy, put_sell, put_deal, put_var)',
#     'items' : '(%s, %s, %s, %s, %s, %s, %s, %s, %s)'
# }


def realtimeOptCrawler(params):
    
    start = params['startTime']
    end = params['endTime']
    current = params['curTime']

    if (time_in_range(start, end, current)):
        # choose day or night
        if ( params['isDay'] ):
            # 選擇權日盤
            url = "https://mis.taifex.com.tw/futures/RegularSession/EquityIndices/Options/"  
        else:
            # 選擇權夜盤
            url = "https://mis.taifex.com.tw/futures/AfterHoursSession/EquityIndices/Options/"
        
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

        for i in range(1):
            # deliver page-source to parse HTML
            page_source = driver.page_source
            listData = parser4realtimeOpt(page_source)

            #turn 2D list into 2D tuple
            tupleData = tuple(map(tuple, listData))

            #update SQL
            updateSQL(tupleData, params['table'], params['columns'], params['items'])
            # print(tupleData)
            # print()

            time.sleep(5)

        # Close window
        driver.quit() 

    else:
        print("Trading time is over... sleep for 2 mins")
        time.sleep(60*2)




def realtimeBigIndexCrawler(params):
    
    start = params['startTime']
    end = params['endTime']
    current = params['curTime']

    if (time_in_range(start, end, current)):

        # choose day or night
        if (params['isDay']):
            # 大盤日盤
            url = "https://mis.taifex.com.tw/futures/RegularSession/EquityIndices/FuturesDomestic/"  
        else:
            #台指期全(夜盤)
            url = "https://mis.taifex.com.tw/futures/AfterHoursSession/EquityIndices/FuturesDomestic/" 

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


        for i in range(1):
            # deliver page-source to parse HTML
            page_source = driver.page_source
            listData = parser4realtimeBigIndex(page_source)

            #turn 2D list into 2D tuple
            tupleData = tuple(map(tuple, listData))

            #update SQL
            updateSQL(tupleData, params['table'], params['columns'], params['items'])
            # print(tupleData)
            # print()

            time.sleep(5)

        # Close window
        driver.quit() 

    else:
        print("Trading time is over... sleep for 2 mins")
        time.sleep(60*2)

