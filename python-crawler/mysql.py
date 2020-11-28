import pymysql


# SQL params setting
db_settings = {
    "host": "newrdshello.cdeaz4rohdnt.us-east-2.rds.amazonaws.com",
    "port": 3306,
    "user": "crawler",
    "password": "1qaz2wsx3edc",
    "db": "myoptions",
    "charset": "utf8"
}

try:

    # try connection
    conn = pymysql.connect(**db_settings)

    # 建立Cursor物件
    cursor = conn.cursor()

    # command = "SELECT * FROM users"
    command = "INSERT INTO users (email, name, localorfb, pic) VALUES (%s, %s, %s, %s)"
    
    # val = ('may@gmail.com', 'May', 'local', 'may.html')
    val = (('may@gmail.com', 'May', 'local', 'may.html'),
        ('jack@gmail.com', 'Jack', 'fb', 'jack.html'),
        ('joy@gmail.com', 'Joy', 'local', 'Joy.html'),
        ('lili@gmail.com', 'Lili', 'fb', 'lili.html'))

    # 執行指令
    # cursor.execute(command, val)
    rows = cursor.executemany(command, val)

    # commit. otherwise, it would fail to alter tables' content
    conn.commit()
    print(rows)
    # 取得所有資料
    # result = cursor.fetchall()
    # print(result)

    # close cursor
    cursor.close()
    # close connection
    conn.close()

except:
    # print(Exception)
    conn.rollback()