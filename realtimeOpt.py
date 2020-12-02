from crawler.comp.comp import basicParams
from crawler.crawler import realtimeOptCrawler


optParams = {
    'isDay': basicParams['isDay'],
    'isNight': basicParams['isNight'],
    'isheadless': False,
    'dayOfWeek' : basicParams['dayOfWeek'],
    'crawlHTMLTimes' : 1,
}

# crawl realtime options
realtimeOptCrawler(optParams)



