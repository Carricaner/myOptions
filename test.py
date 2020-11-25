import time
import datetime
import math
import random
from selenium import webdriver

from bs4 import BeautifulSoup

option = webdriver.ChromeOptions()
option.add_argument('--headless')
option.add_argument('--disable-notifications')

#開啟Chrome
driver = webdriver.Chrome() # check mode
# driver = webdriver.Chrome(options = option) # headless mode

# 日夜盤交替
# url = "https://mis.taifex.com.tw/futures/RegularSession/EquityIndices/Options/"  # 日盤
url = "https://mis.taifex.com.tw/futures/AfterHoursSession/EquityIndices/Options/"  # 夜盤


driver.get(url) #前往網址

time.sleep(2)

# click confirm button
refreshBtn = driver.find_element_by_css_selector("#content > main > div.container > div.approve-wrap > button:nth-child(2)")
refreshBtn.click()

time.sleep(3)


soup = BeautifulSoup(driver.page_source, 'html.parser')
# print whole html
# print(soup.prettify())
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
            # print(price.text, end =" ")
            tempArray.append(price.text)
            counter += 1
        else:

            divText = td.select_one("a div")

            if (counter == 15):
                # print(divText.text)
                tempArray.append(divText.text)
                data.append(tempArray)
                counter = 1
            else:
                # print(divText.text, end =" ")
                tempArray.append(divText.text)
                counter += 1


print(data)



driver.quit() # Close window
