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

# value(s)
values = (('may@gmail.com', 'May', 'local', 'may.html'),
    ('jack@gmail.com', 'Jack', 'fb', 'jack.html'),
    ('joy@gmail.com', 'Joy', 'local', 'Joy.html'),
    ('lili@gmail.com', 'Lili', 'fb', 'lili.html'))


def updateSQL(values, table, columns, items):

    try:
        # make a connection
        conn = pymysql.connect(**db_settings)

        # build a cursor
        cursor = conn.cursor()

        # start a transaction
        conn.begin()

        # commands
        # select = "SELECT * FROM %s" %table
        deleteall = "DELETE FROM %s" %table
        insertFirst = "INSERT INTO %s" %table
        insertMulti = insertFirst + ' ' + columns + ' VALUES ' + items

        # execute command(s)
        # result = cursor.execute(select)
        # result = cursor.fetchall()
        # print(result)
        cursor.execute(deleteall)
        rows = cursor.executemany(insertMulti, values)
        # display how many rows being affected
        print("(Success) There is(are) %d row(s) being affected." %rows) 


        # commit changes
        conn.commit()

        # close cursor
        cursor.close()

        # close connection
        conn.close()

    except:

        print("(Fail) Something went wrong, rolling back changes...")
        conn.rollback()