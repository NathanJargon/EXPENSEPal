from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

def create_database():
    conn = sqlite3.connect('expenses.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            amount REAL NOT NULL,
            date DATE NOT NULL,
            category TEXT
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

if __name__ == '__main__':
    app.run(debug=True)