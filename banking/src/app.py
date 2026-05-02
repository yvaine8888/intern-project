from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

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

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json 
    
    role = data.get('role')
    username = data.get('account')
    password = data.get('password')

    connection = mysql.connector.connect(user = "root", database = "bankingsystem", password = "x1321PF@33")
    cursor = connection.cursor()
    if(role == "admin"):
        query = ('SELECT * FROM adminaccounts WHERE name = %s AND password = %s')
    else:
        query = ('SELECT * FROM useraccounts WHERE name = %s AND password = %s')

    cursor.execute(query, (username, password))
    found = cursor.fetchone()
    cursor.close()
    connection.close()

    if found != None:
        result = {"message": found[1], "status": "ok"}
    else:
        result = {"error": "Invalid data"}
    
    return jsonify(result)

@app.route('/api/create-account', methods=['POST'])
def create():
    try:
        data = request.json 

        role = data.get('role')
        username = data.get('name')
        password = data.get('password')

        connection = mysql.connector.connect(user = "root", database = "bankingsystem", password = "x1321PF@33")
        cursor = connection.cursor()
        query = ""
        pin = unique_number()
        if role == 'admin':
            query = ('INSERT INTO adminaccounts (name, pin, password) VALUES (%s, %s, %s)')
            record = (username, pin, password, 0)
        elif role == 'user':
            query = ('INSERT INTO useraccounts (name, pin, password, amount) VALUES (%s, %s, %s, %s)')
            record = (username, pin, password, 0)
        else:
            cursor.close()
            connection.close()
            return jsonify({"error": "Invalid role."})
        cursor.execute(query, record)
        connection.commit()
        
        cursor.close()
        connection.close()
        return jsonify({"status": "ok"})
    except Exception as e:
        return jsonify({"error": e})

@app.route('/api/close-account', methods=['POST'])
def close():
    data = request.get_json()

    connection = mysql.connector.connect(user = "root", database = "bankingsystem", 
    password = "x1321PF@33")
    cursor = connection.cursor()

    query = ('DELETE FROM adminaccounts WHERE pin = %s')
    cursor.execute(query, (data,))
    connection.commit()

    query = ('DELETE FROM useraccounts WHERE pin = %s')
    cursor.execute(query, (data,))
    connection.commit()
    
    cursor.close()
    connection.close()

@app.route('/api/modify-account', methods=['POST'])
def modify():
    data = request.get_json()
    account = data.account
    name = data.name
    password = data.password
    role = 'admin'

    connection = mysql.connector.connect(user = "root", database = "bankingsystem", 
    password = "x1321PF@33")
    cursor = connection.cursor()

    query = ('SELECT * FROM adminaccounts WHERE pin = %s')

    cursor.execute(query, (username, account,))
    found = cursor.fetchone()

    if found == None:
        query = ('SELECT * FROM useraccounts WHERE pin = %s')
        cursor.execute(query, (username, account,))
        found = cursor.fetchone()
        if found == None:
            return jsonify({"error": "Invalid account."})
        role = 'user'

    if name != "":
        query = (f'UPDATE {role}accounts SET name = %s WHERE pin = %s')
        cursor.execute(query, (name, account))
        connection.commit()

    if password != "":
        query = (f'UPDATE {role}accounts SET Password = %s WHERE pin = %s')
        cursor.execute(query, (password, account))
        connection.commit()
    cursor.close()
    connection.close()

if __name__ == '__main__':
    app.run(debug=True)