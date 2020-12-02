import datetime
from crawler.comp.comp import basicParams
from crawler.crawler import staticBigguyLeftCrawler


params = {
    'isheadless' : True,
    'isUpdateMode' : False,   # False => History mode, will retrieve 'fromWhichDay'
    'fromWhichDay' : '2020/11/25',
    'startCollectTime' : datetime.time(1, 30, 0),
    'endCollectTime' : datetime.time(23, 30, 0),
}


staticBigguyLeftCrawler(params)

