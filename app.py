from flask import Flask, render_template, request, redirect, url_for, send_from_directory, make_response, jsonify
import sqlite3
import csv
from io import StringIO
from waitress import serve
import firebase_admin
from firebase_admin import credentials, auth, db, firestore

app = Flask(__name__, static_url_path='/static')


# Initialize the Firebase Admin SDK with your project credentials
cred = credentials.Certificate('firebase-admin.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

# Function to get the Firebase user ID based on the Firebase ID token
def get_firebase_user_id(firebase_id_token):
    try:
        decoded_token = auth.verify_id_token(firebase_id_token)
        return decoded_token.get('uid')
    except Exception as e:
        # Handle any exceptions that might occur during Firebase Authentication verification
        print(f"Firebase Authentication error: {str(e)}")
        return None


@app.route('/add_expense', methods=['POST'])
def add_expense():
    # Access the JSON data sent with the POST request
    data = request.get_json()

    # Get the Firebase user ID for the currently logged-in user
    firebase_id_token = request.headers.get('Authorization').split('Bearer ')[-1]
    user_id = get_firebase_user_id(firebase_id_token)
    
    if 'uid' in data:
        # Associate the user ID with the expense data
        uid = data['uid']
        # Check if the user is authorized
        # Add the expense data to Firestore
        expenses_ref = db.collection('expenses')
        expenses_ref.add(data)

        response_data = {'message': 'Expense added successfully', 'data': data}
        return jsonify(response_data)
    else:
        return "Unauthorized access"
    

@app.route('/view_expenses')
def view_expenses():
    # Get the Firebase user ID for the currently logged-in user
    firebase_id_token = request.cookies.get('your_firebase_cookie_name')
    user_id = get_firebase_user_id(firebase_id_token)

    if user_id:
        # Fetch and display expenses for the user
        conn = sqlite3.connect('expenses.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM expenses WHERE user_id = ?', (user_id,))
        rows = cursor.fetchall()
        conn.close()
        return render_template('expenses.html', expenses=rows)
    else:
        # Handle unauthorized access by returning a plain text response
        return "Unauthorized access"

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)
    
def create_database():
    conn = sqlite3.connect('expenses.db')
    cursor = conn.cursor()  
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            amount REAL NOT NULL,
            date DATE NOT NULL,
            category TEXT,
            user_id TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

create_database()

def fetch_expenses():
    conn = sqlite3.connect('expenses.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM expenses')
    rows = cursor.fetchall()
    conn.close()
    return rows

@app.route('/delete_expense', methods=['POST'])
def delete_expense():
    if request.method == 'POST':
        expense_id = request.form['expense_id']

        conn = sqlite3.connect('expenses.db')
        cursor = conn.cursor()

        # Delete the expense with the given ID
        cursor.execute('DELETE FROM expenses WHERE id = ?', (expense_id,))
        conn.commit()
        conn.close()

    return redirect(url_for('index'))

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        description = request.form['description']
        amount = float(request.form['amount'])
        date = request.form['date']
        category = request.form['category']

        conn = sqlite3.connect('expenses.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO expenses (description, amount, date, category)
            VALUES (?, ?, ?, ?)
        ''', (description, amount, date, category))
        conn.commit()
        conn.close()

        return redirect(url_for('index'))

    return render_template('index.html', expenses=fetch_expenses())

@app.route('/upload', methods=['GET', 'POST'])
def upload_csv():
    if request.method == 'POST':
        csv_file = request.files['csv_file']

        if csv_file:
            # Read CSV file and parse it
            csv_data = csv_file.read().decode('utf-8')
            csv_reader = csv.reader(StringIO(csv_data))

            # Skip the header row if it exists
            next(csv_reader, None)

            conn = sqlite3.connect('expenses.db')
            cursor = conn.cursor()

            for row in csv_reader:
                if len(row) == 4:
                    description, amount, date, category = row
                    cursor.execute('''
                        INSERT INTO expenses (description, amount, date, category)
                        VALUES (?, ?, ?, ?)
                    ''', (description, float(amount), date, category))

            conn.commit()
            conn.close()

            return redirect(url_for('index'))

    return render_template('upload.html')

if __name__ == '__main__':
    app.run(debug=True)