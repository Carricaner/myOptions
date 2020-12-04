import datetime
from crawler.crawler import staticOptDisCrawler

params = {
    'isheadless' : True,
    'startCollectTime' : datetime.time(1, 30, 0),
    'endCollectTime' : datetime.time(23, 30, 0),
}

staticOptDisCrawler(params)