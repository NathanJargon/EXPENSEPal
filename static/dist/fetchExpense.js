// Function to fetch and update expenses
function fetchAndUpdateExpenses() {
    fetch('/get_expenses') // Replace with your Flask route to fetch expenses
        .then(response => response.json())
        .then(data => {
            console.log('Fetching and updating expenses:', data);

            const tableBody = document.getElementById('expense-table-body');
            tableBody.innerHTML = ''; // Clear the existing rows

            data.expenses.forEach(expense => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                <td class="expense-date">${expense.date}</td>
                <td>${expense.description}</td>
                <td>${expense.category}</td>
                <td>${parseFloat(expense.amount).toFixed(2)}</td> <!-- Format with 2 decimal places -->
                <td style="padding-right: 15px; text-align: right;">
                    <button class="btn btn-primary delete-button-small" data-id="${expense.uid}">Delete</button>
                </td>
                `;

                newRow.querySelector('.delete-button-small').addEventListener('click', () => deleteExpense(expense.uid));

                tableBody.appendChild(newRow);
            });

            // Optionally, you can also update the total
            updateTotal(data.expenses);
        })
        .catch(error => {
            console.error('Error fetching expenses:', error);
        });
}


// Function to delete an expense by ID
function deleteExpense(expenseId) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            user.getIdToken()
                .then(function (idToken) {
                    const id_Token = idToken;
                    document.cookie = 'your_firebase_cookie_name=' + id_Token;

                    fetch(`/delete_expense/${expenseId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + id_Token,
                        },
                    })
                    .then(response => {
                        if (response.ok) {
                            return response.json();  // Assuming the server sends a JSON response on success
                        } else {
                            throw new Error(`Failed to delete expense. Status: ${response.status}`);
                        }
                    })
                    .then(data => {
                        console.log('Expense deleted successfully:', data);
                        fetchAndUpdateExpenses();  // Update the UI after successful deletion
                    })
                    .catch(error => {
                        console.error('Error deleting expense:', error);
                    });
                })
                .catch(function (error) {
                    console.error('Error getting ID token:', error);
                });
        }
    });
}

// Call the function to fetch and update expenses when the page loads
document.addEventListener('DOMContentLoaded', fetchAndUpdateExpenses);
