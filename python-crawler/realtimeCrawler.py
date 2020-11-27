import time
import datetime
import math
import random

from crawlerComponent import mainCrawler, bigIndexCrawler, time_in_range, currentTimeGetter

crawlerParams = {
    'isDay': True,  #False => Night
    'isheadless': True,
    'headless_argu': ['--headless', '--disable-notifications'],
    'startTime': datetime.time(11, 0, 0),
    'endTime': datetime.time(12, 0, 0),
    'curTime': currentTimeGetter('Asia/Shanghai')
}


# crawl realtime options
mainCrawler(crawlerParams)

# crawl realtime bigIndex
# bigIndexCrawler(True)


# print(time_in_range(startTime, endTime, xTime))


