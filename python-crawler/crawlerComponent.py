from selenium import webdriver
from bs4 import BeautifulSoup
import time
import csv
import datetime
import threading
import pytz

# sample@
# crawlerParams = {
#     'isDay': True,  #False => Night
#     'isheadless': True,
#     'headless_argu': ['--headless', '--disable-notifications'],
#     'startTime': datetime.time(11, 0, 0),
#     'endTime': datetime.time(21, 0, 0),
#     'curTime': currentTimeGetter('Asia/Shanghai')
# }


def mainCrawler(crawlerParams):
    
    start = crawlerParams['startTime']
    end = crawlerParams['endTime']
    current = crawlerParams['curTime']

    if (time_in_range(start, end, current)):
        # choose day or night
        if ( crawlerParams['isDay'] ):
            url = "https://mis.taifex.com.tw/futures/RegularSession/EquityIndices/Options/"  # 日盤
        else:
            url = "https://mis.taifex.com.tw/futures/AfterHoursSession/EquityIndices/Options/"  # 夜盤
        
        # choose whether headless or not
        if ( crawlerParams['isheadless'] ):
            option = webdriver.ChromeOptions()
            for item in crawlerParams['headless_argu']:
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

        # deliver page-source to parse HTML
        for i in range(2):
            page_source = driver.page_source
            data = htmlScriptParser(page_source)
            print(data)
            print()
            time.sleep(5)
            
        # csvUpdatter(data)
        # print("csv updated!")

        # Close window
        driver.quit() 

    else:
        print("Trading time is over... ready to sleep for another term")
        time.sleep(60*15)




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


def currentTimeGetter(timezone):
    # Choose Changhai's time zone
    tz = pytz.timezone(timezone)
    curHr = datetime.datetime.now(tz).hour
    curMin = datetime.datetime.now(tz).minute
    curSec = datetime.datetime.now(tz).second
    return datetime.time(curHr, curMin, curSec)    

# 搬家的時候要注意, 因為mainCrawler有用到這個function
def time_in_range(start, end, x):
    """Return true if x is in the range [start, end]"""
    if start <= end:
        return start <= x <= end
    else:
        return start <= x or x <= end

# ↓↓↓↓↓↓↓↓↓↓  python repeater test  ↓↓↓↓↓↓↓↓↓↓
def do_job(num):
    # threading.Timer(2,do_job,())
    # 第一个参数: 延迟多长时间执行任务(单位: 秒)
    # 第二个参数: 要执行的任务, 即函数
    # 第三个参数: 调用函数的参数(tuple)
    # global timer
    num += 1
    print("do_job times：", num)
    print("current used thread(s)：{}".format(threading.active_count()))
    print("\n")
    if num > 4:
        return
    print(datetime.datetime.now().strftime("%H-%m-%d %H:%M:%S"))
    timer = threading.Timer(5, do_job, (num,))
    timer.start()
# ↑↑↑↑↑↑↑↑↑↑  python repeater test  ↑↑↑↑↑↑↑↑↑↑




def bigIndexCrawler(headless = True):

    url = "https://mis.taifex.com.tw/futures/RegularSession/EquityIndices/FuturesDomestic/"  # 大盤
    
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
    soup = BeautifulSoup(page_source, 'html.parser')
    tbody = soup.select_one("table.table.quotes-table.mb-1.sticky-table-horizontal tbody")
    trs = tbody.select("tr")
    data = []
    for tr in trs:
        tds = tr.select("td")
        counter = 1
        tempArray = []
        designatedColumns = [1, 7, 8, 11, 12, 13]

        for td in tds:
            
            if counter in designatedColumns:
                if counter == 1:
                    productName = td.select_one("a")
                    tempArray.append(productName.text)
                else:
                    index = td.select_one("span")
                    tempArray.append(index.text)
            
            if counter == 15:
                data.append(tempArray)
                counter = 1
            else:
                counter += 1

    print(data)


    # Close window
    driver.quit() 






# if __name__ == '__main__':
#     htmlScriptParser(page_source)
#     mainCrawler(dayNightChanger, headless = True)