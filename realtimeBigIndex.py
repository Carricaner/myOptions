import time
import datetime
import math
import random
import redis

from crawler.crawler import realtimeOptCrawler, realtimeBigIndexCrawler, staticOptDisCrawler
from crawler.timeManager import currentTimeGetter, getNowDayOfWeek, currentDateGetter



optParams = {
    'isDay': True,  #False => Night
    'isheadless': True,
    'headless_argu': ['--headless', '--disable-notifications'],

    'startTime': datetime.time(9, 0, 0),
    'endTime': datetime.time(13, 30, 0),
    'curTime': currentTimeGetter('Asia/Shanghai'),
    'dayOfWeek' : getNowDayOfWeek('Asia/Shanghai'),

    'table' : 'realtime_opt',
    'columns' : '(call_var, call_deal, call_sell, call_buy, target, put_buy, put_sell, put_deal, put_var)',
    'items' : '(%s, %s, %s, %s, %s, %s, %s, %s, %s)'
}

bigIndexParams = {
    'isDay': True,  #False => Night
    'isheadless': True,
    'headless_argu': ['--headless', '--disable-notifications'],

    'startTime': datetime.time(11, 0, 0),
    'endTime': datetime.time(23, 0, 0),
    'curTime': currentTimeGetter('Asia/Shanghai'),
    'dayOfWeek' : getNowDayOfWeek('Asia/Shanghai'),

    'table' : 'realtime_bigindex',
    'columns' : '(name, status, dealprice, price_var, open, high, low)',
    'items' : '(%s, %s, %s, %s, %s, %s, %s)'
}

# crawl realtime bigIndex
# realtimeBigIndexCrawler(bigIndexParams)

# crawl static options distribution
# staticOptDisCrawler()


r = redis.Redis(host='localhost', port=6379, decode_responses=True)

r.set("test", "a4w84d8wad")

print(r.get("test"))
