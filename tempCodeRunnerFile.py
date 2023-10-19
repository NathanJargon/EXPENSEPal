from flask import Flask, render_template, request, redirect, url_for, send_from_directory, make_response
import logging
import sqlite3
import csv
from io import StringIO
from waitress import serve
import firebase_admin
from firebase_admin import credentials, auth, firestore

app = Flask(__name__, static_url_path='/static')

#logging.basicConfig(level=logging.DEBUG)

# Initialize the Firebase Admin SDK with your project credentials
cred = credentials.Certificate('firebase-admin.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

# Function to get the Firebase user ID based on the Firebase ID token
def get_firebase_user_id(firebase_id_token):
    try:
        decoded_token = auth.verify_id_token(firebase_id_token)
        return decoded_token['uid']
    except auth.AuthError:
        return None

@app.route('/add_expense', methods=['POST'])
def add_expense():
    if request.method == 'POST':
        description = request.json.get('description')
        amount = float(request.json.get('amount'))
        date = request.json.get('date')
        category = request.json.get('category')

        # Get the Firebase UID of the user (you already have this)
        firebase_user_id = request.headers.get('Authorization').split('Bearer ')[1]

        # Access the Firestore user's document
        user_doc = db.collection('users').document(firebase_user_id)

        # Add the expense data to the "expenses" subcollection
        user_doc.collection('expenses').add({
            'description': description,
            'amount': amount,
            'date': date,
            'category': category
        })

    return redirect(url_for('index'))



@app.route('/view_expenses')
def view_expenses():
    # Get the Firebase user ID for the currently logged-in user
    firebase_id_token = request.cookies.get('your_firebase_cookie_name')
    user_id = get_firebase_user_id(firebase_id_token)

    if user_id:
        # Fetch and display expenses for the user from Firestore
        user_expenses = db.collection('users').document(user_id).collection('expenses').stream()
        expenses = [expense.to_dict() for expense in user_expenses]
        return render_template('expenses.html', expenses=expenses)
    else:
        # Handle unauthorized access
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
    app.run() #debug=True
