from crawler.comp.comp import basicParams
from crawler.crawler import realtimeBigIndexCrawler


bigIndexParams = {
    'isDay': basicParams['isDay'],
    'isNight': basicParams['isNight'],
    'isheadless': False,
    'dayOfWeek' : basicParams['dayOfWeek'],
    'crawlHTMLTimes' : 1,
}

# crawl realtime bigIndex
realtimeBigIndexCrawler(bigIndexParams)

