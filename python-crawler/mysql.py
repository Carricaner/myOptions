import pymysql


# SQL params setting
db_settings = {
    "host": "newrdshello.cdeaz4rohdnt.us-east-2.rds.amazonaws.com",
    "port": 3306,
    "user": "crawler",
    "password": "1qaz2wsx3edc",
    "db": "stylish",
    "charset": "utf8"
}

try:
    # try connection
    conn = pymysql.connect(**db_settings)

    # 建立Cursor物件
    cursor = conn.cursor()
    command = 'SELECT description FROM product'

    # 執行指令
    cursor.execute(command)

    # 取得所有資料
    result = cursor.fetchall()

    print(result)



except Exception as ex:
    print(ex)