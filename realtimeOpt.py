import math
import random

from crawler.comp.comp import basicParams
from crawler.crawler import realtimeOptCrawler, realtimeBigIndexCrawler, staticOptDisCrawler
from crawler.timeManager import currentTimeGetter, getNowDayOfWeek, currentDateGetter, time_in_range


optParams = {
    'isDay': basicParams['isDay'],
    'isNight': basicParams['isNight'],
    'isheadless': False,
    'dayOfWeek' : basicParams['dayOfWeek'],
    'crawlHTMLTimes' : 1,
}

# crawl realtime options
# realtimeOptCrawler(optParams)

# crawl static options distribution
# staticOptDisCrawler()


