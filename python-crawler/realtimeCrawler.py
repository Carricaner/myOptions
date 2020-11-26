import time
import datetime
import math
import random

from crawlerComponent import mainCrawler

startTime = datetime.time(11, 0, 0)
endTime = datetime.time(20, 45, 0)

mainCrawler('night', startTime, endTime)
