import datetime
import threading
import pytz

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



if __name__ == '__main__':
    do_job(0)
