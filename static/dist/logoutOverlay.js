const logoutButton = document.getElementById('loginLogout');
const logout_textContent = document.getElementById('loginLogoutLink');
const userNameElement = document.getElementById('userName');
const totalElement = document.getElementById('total');
const totalSpan = totalElement.querySelector('.total-span');

function updateTotal() {
    // Get all the expense rows
    const expenseRows = document.querySelectorAll('table tbody tr');
    console.log(expenseRows);

    // Initialize the total
    let total = 0;

    // Loop through each row
    for (let i = 0; i < expenseRows.length; i++) {
        // Get the expense amount (assuming it's in the fourth column, adjust if necessary)
        const expenseAmountText = expenseRows[i].querySelector('td:nth-child(4)').textContent;
        const expenseAmount = parseFloat(expenseAmountText);

        // Check if the amount is a valid number and an integer
        if (!isNaN(expenseAmount) && Number.isInteger(expenseAmount)) {
            // Add the amount to the total
            total += expenseAmount;
        }
    }

    // Display the total with two decimal places
    const totalElement = document.getElementById('total');
    const totalSpan = totalElement.querySelector('.total-span');
    totalSpan.textContent = total.toFixed(2); // Format as a decimal with 2 decimal places
}

// Function to set the user name in localStorage
function setUserNameInLocalStorage(userName) {
    localStorage.setItem('userName', userName);
}

function clearUserNameFromLocalStorage() {
    localStorage.removeItem('userName');
    userNameElement.textContent = 'User';
    logout_textContent.textContent = 'Login';
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        const totalSpan = document.querySelector('#total');
        totalSpan.textContent = '0.00';
        // Clear the table data
        const expenseTableBody = document.querySelector('table tbody');
        while (expenseTableBody.firstChild) {
            expenseTableBody.removeChild(expenseTableBody.firstChild);
        }

        logout_textContent.textContent = 'Login';
        userNameElement.textContent = 'User';
        // Optionally, you can redirect the user to a login page or perform other actions.
    }).catch((error) => {
        // An error occurred during sign-out.
        console.error('Sign-out error:', error);
    });
}

// Check if the user name is stored in localStorage
const storedUserName = localStorage.getItem('userName');

if (storedUserName) {
    // If a user name is found, set it and show "Logout" instead of "Login"
    userNameElement.textContent = storedUserName;
    logout_textContent.textContent = 'Logout';
    startLogoutTimer();
} else {
    // If no user name is found, show "Login"
    logout_textContent.textContent = 'Login';
}

// Start the timer when the user logs in
function startLogoutTimer() {
    setTimeout(() => {
        clearUserNameFromLocalStorage();
    }, 20 * 60 * 1000); // 20 minutes in milliseconds
}

logoutButton.addEventListener('click', () => {
    if (logout_textContent.textContent === 'Logout') {
        clearUserNameFromLocalStorage();
    }
});
