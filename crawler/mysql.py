import pymysql
from dotenv import load_dotenv
import os

# load env in crawler package
load_dotenv()

# SQL params setting
db_settings = {
    "host": os.getenv("aws_rds_mysql_HOST"),
    "port": 3306,
    "user": os.getenv("aws_rds_mysql_USER"),
    "password": os.getenv("aws_rds_mysql_PASSWORD"),
    "db": os.getenv("aws_rds_mysql_DATABASE"),
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


# print(db_settings)