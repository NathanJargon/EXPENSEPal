// Function to fetch and update expenses
function fetchAndUpdateExpenses() {
    //console.log('feth loaded');
    fetch('/get_expenses') // Replace with your Flask route to fetch expenses
        .then(response => response.json())
        .then(data => {
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
                    <button class="btn btn-primary delete-button-small" data-id="${expense.user_id}">Delete</button>
                </td>
                `;

                newRow.querySelector('.delete-button-small').addEventListener('click', deleteExpense);

                tableBody.appendChild(newRow);
            });

            // Optionally, you can also update the total
            updateTotal(data.expenses);
        })
        .catch(error => {
            console.error('Error fetching expenses:', error);
        });
}

// Call the function to fetch and update expenses when the page loads
document.addEventListener('DOMContentLoaded', fetchAndUpdateExpenses);