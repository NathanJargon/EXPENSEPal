from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

expenses = []

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        description = request.form['description']
        amount = float(request.form['amount'])
        date = request.form['date']
        category = request.form['category']
        expenses.append({'description': description, 'amount': amount, 'date': date, 'category': category})
        return redirect(url_for('index'))  # To avoid submitting the same forms! <3
    return render_template('index.html', expenses=expenses)

if __name__ == '__main__':
    app.run(debug=True)
