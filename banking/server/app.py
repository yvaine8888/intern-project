import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import pooling
import dotenv
import random

app = Flask(__name__)
CORS(app)

dotenv.load_dotenv()

db_pool = pooling.MySQLConnectionPool(
    pool_name="bankingsystem_pool",
    pool_size=5, 
    host=os.getenv('DB_HOST', 'localhost'),
    user=os.getenv('DB_USER', 'root'),
    password=os.getenv('DB_PASSWORD'), 
    database=os.getenv('DB_NAME', 'bankingsystem')
)

def unique_number():
    num = 0
    db = db_pool.get_connection()
    cursor = db.cursor()

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
    db.close()
    return num

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json 
    
    role = data.get('role')
    username = data.get('account')
    password = data.get('password')
    
    print(role)
    print(username)
    print(password)

    db = db_pool.get_connection()
    cursor = db.cursor(dictionary=True)

    if(role == "admin"):
        query = ('SELECT * FROM adminaccounts WHERE pin = %s AND password = %s')
    else:
        query = ('SELECT * FROM useraccounts WHERE pin = %s AND password = %s')

    cursor.execute(query, (username, password))
    found = cursor.fetchone()

    print(found)
    cursor.close()
    db.close()

    if found is not None:
        result = {"message": found['name'], "status": "ok"}
    else:
        result = {"message": "Invalid credentials", "status": "error"}
    
    return jsonify(result)

@app.route('/api/create-account', methods=['POST'])
def create():
    data = request.json 

    role = data.get('role')
    username = data.get('name')
    password = data.get('password')

    db = db_pool.get_connection()
    cursor = db.cursor()
    query = ""
    pin = unique_number()
    if role == 'admin':
        query = ('INSERT INTO adminaccounts (name, pin, password) VALUES (%s, %s, %s)')
        record = (username, pin, password)
    elif role == 'user':
        query = ('INSERT INTO useraccounts (name, pin, password, amount) VALUES (%s, %s, %s, %s)')
        record = (username, pin, password, 0)
    else:
        cursor.close()
        db.close()
        return jsonify({"message": "Invalid role", "status": "error"})
    
    cursor.execute(query, record)
    db.commit()
    
    cursor.close()
    db.close()
    return jsonify({"message": str(pin), "status": "ok"})

@app.route('/api/close-account', methods=['POST'])
def close():
    data = request.get_json()

    db = db_pool.get_connection()
    cursor = db.cursor()

    query = ('SELECT * FROM adminaccounts WHERE pin = %s')
    cursor.execute(query, (username, data,))
    found = cursor.fetchone()

    query = ('SELECT * FROM useraccounts WHERE pin = %s')
    cursor.execute(query, (username, data,))
    found += cursor.fetchone()

    if found == None:
        return jsonify({"status": "error"})

    query = ('DELETE FROM adminaccounts WHERE pin = %s')
    cursor.execute(query, (data,))
    db.commit()

    query = ('DELETE FROM useraccounts WHERE pin = %s')
    cursor.execute(query, (data,))
    db.commit()
    
    cursor.close()
    db.close()
    return jsonify({"status": "ok"})

@app.route('/api/modify-account', methods=['POST'])
def modify():
    data = request.get_json()
    account = data.account
    name = data.name
    password = data.password
    role = 'admin'

    db = db_pool.get_connection()
    cursor = db.cursor()

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
        db.commit()

    if password != "":
        query = (f'UPDATE {role}accounts SET Password = %s WHERE pin = %s')
        cursor.execute(query, (password, account))
        db.commit()
    cursor.close()
    db.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)