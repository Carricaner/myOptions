import datetime
from crawler.comp.comp import basicParams
import datetime
from crawler.crawler import staticBigIndexCrawler

params = {
    'isheadless' : True,
    'startCollectTime' : datetime.time(16, 30, 0),
    'endCollectTime' : datetime.time(18, 00, 0),
}

staticBigIndexCrawler(params)