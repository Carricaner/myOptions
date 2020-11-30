import time
import datetime
import threading
import pytz



def currentTimeGetter(timezone):
    # Choose Shanghai's time zone
    tz = pytz.timezone(timezone)
    curHr = datetime.datetime.now(tz).hour
    curMin = datetime.datetime.now(tz).minute
    curSec = datetime.datetime.now(tz).second
    return datetime.time(curHr, curMin, curSec)    


def getNowDayOfWeek(timezone):
    tz = pytz.timezone(timezone)
    today = datetime.datetime.now(tz)
    return today.date().weekday()



# 搬家的時候要注意, 因為mainCrawler有用到這個function
def time_in_range(start, end, x):
    """Return true if x is in the range [start, end]"""
    if start <= end:
        return start <= x <= end
    else:
        return start <= x or x <= end


# ↓↓↓↓↓↓↓↓↓↓  python repeater test  ↓↓↓↓↓↓↓↓↓↓
def do_job(num):
    # threading.Timer(2,do_job,())
    # 第一个参数: 延迟多长时间执行任务(单位: 秒)
    # 第二个参数: 要执行的任务, 即函数
    # 第三个参数: 调用函数的参数(tuple)
    # global timer
    num += 1
    print("do_job times：", num)
    print("current used thread(s)：{}".format(threading.active_count()))
    print("\n")
    if num > 4:
        return
    print(datetime.datetime.now().strftime("%H-%m-%d %H:%M:%S"))
    timer = threading.Timer(5, do_job, (num,))
    timer.start()
# ↑↑↑↑↑↑↑↑↑↑  python repeater test  ↑↑↑↑↑↑↑↑↑↑