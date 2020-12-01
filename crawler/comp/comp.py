import time
import datetime
import math
import random


from crawler.crawler import realtimeOptCrawler, realtimeBigIndexCrawler, staticOptDisCrawler
from crawler.timeManager import currentTimeGetter, getNowDayOfWeek, currentDateGetter, time_in_range


basicParams = {
    'dayBeginTime' : datetime.time(9, 0, 0),
    'dayEndTime' : datetime.time(13, 30, 0),
    'isDay' : time_in_range(datetime.time(9, 0, 0), datetime.time(13, 30, 0), currentTimeGetter('Asia/Shanghai')),
    'nightBeginTime' : datetime.time(15, 0, 0),
    'nightEndTime' : datetime.time(5, 0, 0),
    'isNight' : time_in_range(datetime.time(15, 0, 0), datetime.time(5, 0, 0), currentTimeGetter('Asia/Shanghai')),
    'currentTime' : currentTimeGetter('Asia/Shanghai'),
    'dayOfWeek' : getNowDayOfWeek('Asia/Shanghai'),  # 0 to 6 represents days in a week respectively
}

