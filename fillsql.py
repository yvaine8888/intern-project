import random
import mysql.connector
def unique_number():
    num = 0
    connection = mysql.connector.connect(user = "root", database = "bankingsystem", password = "x1321PF@33")
    cursor = connection.cursor()

    while True:
        num = random.randint(100000, 999999)
        query = ('SELECT * FROM adminaccounts WHERE pin = %s')
        cursor.execute(query, (num,))
        if cursor.fetchone() == None:
            query = ('SELECT * FROM useraccounts WHERE pin = %s')
            cursor.execute(query, (num,))
            if cursor.fetchone() == None:
                break
    cursor.close()
    connection.close()
    return num

userNames = "Esther Stafford, Alfredo Edwards, Ivy Porter, Rhett Silva, Lucia McKee, Bjorn Cain, Kendra Mayer, Yahir Cook, Aaliyah McCullough, Briar Parsons, Maia Sims, Brian McCarty, Halo Moore, Levi Ware, Eileen Deleon, Nasir Bush, Everlee Murphy, Cameron Adams, Stella Rich, Miller Armstrong, Presley Griffin, Ayden Walton, Scarlet Hunter, Archer Mann, Paislee Dickerson"
adminNames = "Flynn Flowers, Ariya Robertson, Emiliano Pratt, Ailani Erickson, Johnny McKay, Leanna Nash, Chandler Klein, Elianna Ford, Luis Ware, Eileen Jacobs, Bryan Morris, Genesis Raymond, Maurice Bauer, Haley Archer, Ephraim Sandoval, Elsie Hubbard, Forrest Gonzalez, Abigail Lane, Matias Huffman"
passwords = "123456,123456789,qwerty,password,12345,qwerty123,1q2w3e,12345678,111111,1234567890"
passwords = passwords.split(',')

connection = mysql.connector.connect(user = "root", database = "bankingsystem", password = "x1321PF@33")
cursor = connection.cursor()
for name in userNames.split(", "):
    pin = unique_number()
    query = ('INSERT INTO useraccounts (name, pin, password, amount) VALUES (%s, %s, %s, %s)')
    record = (name, pin, random.choice(passwords), random.randint(0, 999999))
    cursor.execute(query, record)
    connection.commit()
for name in adminNames.split(", "):
    pin = unique_number()
    query = ('INSERT INTO adminaccounts (name, pin, password) VALUES (%s, %s, %s)')
    record = (name, pin, random.choice(passwords))
    cursor.execute(query, record)
    connection.commit()
cursor.close()
connection.close()