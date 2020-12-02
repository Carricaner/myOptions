import datetime
from crawler.comp.comp import basicParams
from crawler.crawler import staticBigIndexCrawler

params = {
    'isheadless' : True,
    'startCollectTime' : datetime.time(1, 30, 0),
    'endCollectTime' : datetime.time(23, 30, 0),
}

staticBigIndexCrawler(params)