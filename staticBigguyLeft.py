import datetime
from crawler.comp.comp import basicParams
from crawler.crawler import staticBigguyLeftCrawler


params = {
    'isheadless' : True,
    'isUpdateMode' : True,   # False => History mode, will retrieve 'fromWhichDay'
    'fromWhichDay' : '2020/11/25',
    'startCollectTime' : datetime.time(16, 30, 0),
    'endCollectTime' : datetime.time(18, 00, 0),
}


staticBigguyLeftCrawler(params)

