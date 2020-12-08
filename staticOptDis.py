import datetime
from crawler.crawler import staticOptDisCrawler

params = {
    'isheadless' : True,
    'startCollectTime' : datetime.time(16, 30, 0),
    'endCollectTime' : datetime.time(16, 32, 0),
}

staticOptDisCrawler(params)