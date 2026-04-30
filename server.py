from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json 
    
    role = data.get('bankRole')
    username = data.get('username')
    password = data.get('password')

    connection = mysql.connector.connect(user = "root", database = "example", password = "x1321PF@33")
    cursor = connection.cursor()
    query = ('SELECT * FROM login_info WHERE Username = %s AND Password = %s')
    cursor.execute(query, (username, pwd))
    found = cursor.fetchone()

    # If there is break but if not, print error
    if found != None:
        cursor.close()
        connection.close()
        message = f"Welcome back, {found[4]} {found[3]}!"
        return username, message, found[4]
    else:
        print("There is something wrong with the username or password. Please try again.")

    cursor.close()
    connection.close()

    if username == "admin" and password == "1234":
        return "Login successful!", 200
    else:
        return "Invalid credentials", 401

if __name__ == '__main__':
    app.run(debug=True)