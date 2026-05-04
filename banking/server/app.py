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

    db = db_pool.get_connection()
    cursor = db.cursor(dictionary=True)

    if(role == "admin"):
        query = ('SELECT * FROM adminaccounts WHERE pin = %s AND password = %s')
    else:
        query = ('SELECT * FROM useraccounts WHERE pin = %s AND password = %s')

    cursor.execute(query, (username, password))
    found = cursor.fetchone()

    cursor.close()
    db.close()

    if found is not None:
        result = {"message": found['name'], "status": "ok"}
    else:
        result = {"status": "error"}
    
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
    cursor.execute(query, (data,))
    found = cursor.fetchone()

    query = ('SELECT * FROM useraccounts WHERE pin = %s')
    cursor.execute(query, (data,))
    foundtwo = cursor.fetchone()

    if found is None and foundtwo is None:
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
    account = data['account']
    name = data['name']
    password = data['password']
    role = 'admin'

    db = db_pool.get_connection()
    cursor = db.cursor()

    query = ('SELECT * FROM adminaccounts WHERE pin = %s')

    cursor.execute(query, (account,))
    found = cursor.fetchone()

    if found is None:
        query = ('SELECT * FROM useraccounts WHERE pin = %s')
        cursor.execute(query, (account,))
        found = cursor.fetchone()
        if found is None:
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

    return jsonify({"status": "ok"})

@app.route('/api/balance', methods=['POST'])
def checkBalance():
    data = request.json 

    db = db_pool.get_connection()
    cursor = db.cursor(dictionary=True)

    query = ('SELECT * FROM useraccounts WHERE pin = %s')

    cursor.execute(query, (data,))
    found = cursor.fetchone()

    cursor.close()
    db.close()
    
    return jsonify({"amount": found['amount']})

@app.route('/api/change-balance', methods=['POST'])
def changeBalance():
    data = request.json 
    account = data['account']
    task = data['task']
    amount = float(data['amount'])

    db = db_pool.get_connection()
    cursor = db.cursor(dictionary=True)

    query = ('SELECT * FROM useraccounts WHERE pin = %s')

    cursor.execute(query, (account,))
    result = cursor.fetchone()['amount']
    if task == "with":
        result -= amount
    else:
        result += amount

    query = ('UPDATE useraccounts SET amount = %s WHERE pin = %s')
    cursor.execute(query, (result, account))
    db.commit()

    cursor.close()
    db.close()

    return jsonify({"status": "ok"})

@app.route('/api/transfer', methods=['POST'])
def transfer():
    data = request.json 
    account = data['account']
    otherAccount = data['otherAccount']
    amount = float(data['amount'])

    db = db_pool.get_connection()
    cursor = db.cursor(dictionary=True)

    query = ('SELECT * FROM useraccounts WHERE pin = %s')

    cursor.execute(query, (account,))
    result = cursor.fetchone()['amount']
    result -= amount

    query = ('UPDATE useraccounts SET amount = %s WHERE pin = %s')
    cursor.execute(query, (result, account))

    query = ('SELECT * FROM useraccounts WHERE pin = %s')

    cursor.execute(query, (otherAccount,))
    result = cursor.fetchone()['amount']
    result += amount

    query = ('UPDATE useraccounts SET amount = %s WHERE pin = %s')
    cursor.execute(query, (result, otherAccount))
    db.commit()

    cursor.close()
    db.close()
    return jsonify({"status": "ok"})
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)