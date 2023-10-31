document.addEventListener('DOMContentLoaded', function () {
    const expenseForm = document.getElementById('expense-form');
    
    if (expenseForm) {
        expenseForm.addEventListener('submit', (event) => {
            event.preventDefault();
          
            const description = document.querySelector('input[name="description"]').value;
            const amount = document.querySelector('input[name="amount"]').value;
            const date = document.querySelector('input[name="date"]').value;
            const category = document.querySelector('input[name="category"]').value;
          
            const expenseData = {
                description,
                amount,
                date,
                category,
            };
          
            fetch('/add_expense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expenseData),
            })
            .then(response => {
                if (response.status === 200) {
                    fetchAndUpdateExpenses();
                } else {
                    console.error('Failed to add expense:', response.status);
                }
            })
            .catch(error => {
                console.error('Error adding expense:', error);
            });
        });
    }
});
