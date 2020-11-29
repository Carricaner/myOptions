import time
import datetime
import math
import random


from crawler.crawler import realtimeOptCrawler, realtimeBigIndexCrawler
from crawler.timeManager import currentTimeGetter
from crawler.test import tuple2


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
# realtimeOptCrawler(optParams)

# crawl realtime bigIndex
realtimeBigIndexCrawler(True)


# print(tuple2)




