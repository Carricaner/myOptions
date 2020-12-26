from crawler.comp.comp import basicParams
from crawler.crawler import realtimeOptCrawler


optParams = {
    'currentTime': basicParams['currentTime'],
    'isDay': basicParams['isDay'], 
    'isNight': basicParams['isNight'],
    'isheadless': True,
    'dayOfWeek' : basicParams['dayOfWeek'],
    'crawlHTMLTimes' : 1000,
}

# crawl realtime options
realtimeOptCrawler(optParams)



