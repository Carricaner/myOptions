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


def updateSQL(values, table, columns, items, depleteFormer):

    try:
        # make a connection
        conn = pymysql.connect(**db_settings)

        # build a cursor
        cursor = conn.cursor()

        # start a transaction
        conn.begin()

        # commands
        # select = "SELECT * FROM %s" %table

        if (depleteFormer):
            deleteall = "DELETE FROM %s" %table
            cursor.execute(deleteall)
        
        insertFirst = "INSERT INTO %s" %table
        insertMulti = insertFirst + ' ' + columns + ' VALUES ' + items

        # execute command(s)
        # result = cursor.execute(select)
        # result = cursor.fetchall()
        # print(result)
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


def flushSQL(table):

    try:
        # make a connection
        conn = pymysql.connect(**db_settings)

        # build a cursor
        cursor = conn.cursor()

        # start a transaction
        conn.begin()
        
        deleteall = "DELETE FROM %s" %table
        
        cursor.execute(deleteall)

        # display how many rows being affected
        print("SQL is depleted.") 

        # commit changes
        conn.commit()

        # close cursor
        cursor.close()

        # close connection
        conn.close()

    except:

        print("(Fail) Something went wrong, rolling back changes...")
        conn.rollback()

