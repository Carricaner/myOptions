
import time
import datetime

def testfunc():
    time.sleep(2)
    print("I am here")


val = [['may@gmail.com', 'May', 'local', 'may.html'],
    ['jack@gmail.com', 'Jack', 'fb', 'jack.html'],
    ['joy@gmail.com', 'Joy', 'local', 'Joy.html'],
    ['lili@gmail.com', 'Lili', 'fb', 'lili.html']]



tuple2 = tuple(map(tuple,val))



if __name__ == '__main__':
    # testfunc()
    print(tuple2)
