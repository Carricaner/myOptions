from selenium import webdriver
from bs4 import BeautifulSoup
import time
import csv
import datetime
import threading
import pytz


def mainCrawler(dayNightChanger, startTime, endTime, headless = True):
    # choose day or night
    if ( dayNightChanger == 'day' ):
        url = "https://mis.taifex.com.tw/futures/RegularSession/EquityIndices/Options/"  # 日盤
    elif (dayNightChanger == 'night'):
        url = "https://mis.taifex.com.tw/futures/AfterHoursSession/EquityIndices/Options/"  # 夜盤
    
    # choose whether headless or not
    if ( headless ):
        option = webdriver.ChromeOptions()
        option.add_argument('--headless')
        option.add_argument('--disable-notifications')
        driver = webdriver.Chrome(options = option)
    else:
        driver = webdriver.Chrome()
    # get URL
    driver.get(url) 
    time.sleep(2)
    # click confirm button
    refreshBtn = driver.find_element_by_css_selector("#content > main > div.container > div.approve-wrap > button:nth-child(2)")
    refreshBtn.click()
    time.sleep(2)

    # deliver page-source to parse HTML
    page_source = driver.page_source
    data = htmlScriptParser(page_source)
    csvUpdatter(data)
    print("csv updated!")

    # parseHTMLrepeater(startTime, endTime, htmlScriptParser, page_source, csvUpdatter)
    
    

    # Close window
    driver.quit() 




def htmlScriptParser(page_source):
    soup = BeautifulSoup(page_source, 'html.parser')
    tbody = soup.select_one("table.sticky-table-horizontal-2 tbody")
    trs = tbody.select("tr")
    data = []
    for tr in trs:
        tds = tr.select("td")
        counter = 1
        tempArray = []
        for td in tds:
            if (counter == 8):
                price = td.select_one("div")
                tempArray.append(price.text)
                counter += 1
            else:
                if ( 4 <= counter <= 12):
                    divText = td.select_one("a div")
                    tempArray.append(divText.text)
                if (counter == 15):
                    data.append(tempArray)
                    counter = 1
                else:
                    counter += 1
    return data



def csvUpdatter(data):
    
    with open("realtimeData.csv", 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        colunmNames = [
            "callIncrement",
            "callDealPrice",
            "callSellPrice",
            "callBuyPrice",
            "strikePrice",
            "putBuyPrice",
            "putSellPrice",
            "putDealPrice",
            "putIncrement"
        ]
        writer.writerow(colunmNames)
        writer.writerows(data)


# def parseHTMLrepeater(startTime, endTime, parseHTML, htmlSource, writeCSV):
#     timezone = 'Asia/Shanghai'
#     curWholeTime = currentTimeGetter(timezone)

#     if (time_in_range(startTime, endTime, curWholeTime)):
#         data = parseHTML(htmlSource)
#         writeCSV(data)
#         print("CSV updated!")
#         timer = threading.Timer(25, parseHTMLrepeater, (startTime, endTime, parseHTML, htmlSource, writeCSV))
#         timer.start()
#     else:
#         return



def currentTimeGetter(timezone):
    # Choose Changhai's time zone
    tz = pytz.timezone(timezone)
    curHr = datetime.datetime.now(tz).hour
    curMin = datetime.datetime.now(tz).minute
    curSec = datetime.datetime.now(tz).second
    return datetime.time(curHr, curMin, curSec)    


def time_in_range(start, end, x):
    """Return true if x is in the range [start, end]"""
    if start <= end:
        return start <= x <= end
    else:
        return start <= x or x <= end


# def crawler():

#     print("current used thread(s)：{}".format(threading.active_count()))
#     timezone = 'Asia/Shanghai'
#     startTime = datetime.time(11, 0, 0)
#     endTime = datetime.time(20, 15, 0)
#     curWholeTime = currentTimeGetter(timezone)

#     if (time_in_range(startTime, endTime, curWholeTime)):
#         timer = threading.Timer(3, crawler, ())
#         print(curWholeTime)
#         timer.start()








# if __name__ == '__main__':
#     htmlScriptParser(page_source)
#     mainCrawler(dayNightChanger, headless = True)