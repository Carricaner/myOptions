import time
import datetime
import math
import random

from crawlerComponent import mainCrawler, bigIndexCrawler, time_in_range, currentTimeGetter

optParams = {
    'isDay': True,  #False => Night
    'isheadless': True,
    'headless_argu': ['--headless', '--disable-notifications'],
    'startTime': datetime.time(11, 0, 0),
    'endTime': datetime.time(23, 0, 0),
    'curTime': currentTimeGetter('Asia/Shanghai'),
    'table' : 'realtime_opt',
    'columns' : '(call_var, call_deal, call_sell, call_buy, target, put_buy, put_sell, put_deal, put_var)',
    'items' : '(%s, %s, %s, %s, %s, %s, %s, %s, %s)'
}


# crawl realtime options
# mainCrawler(optParams)

# crawl realtime bigIndex
bigIndexCrawler(True)


# print(time_in_range(startTime, endTime, xTime))



