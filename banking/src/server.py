from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json 
    
    role = data.get('bankRole')
    username = data.get('username')
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
        result = {"message": f"Welcome back, {found[1]}", "status": "ok"}
    else:
        result = {"error": "Invalid data"}
    
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)