const logoutButton = document.getElementById('loginLogout');
const logout_textContent = document.getElementById('loginLogoutLink');
const userNameElement = document.getElementById('userName');

// Function to set the user name in localStorage
function setUserNameInLocalStorage(userName) {
    localStorage.setItem('userName', userName);
}

// Function to clear the userName from localStorage
function clearUserNameFromLocalStorage() {
    localStorage.removeItem('userName');
    userNameElement.textContent = 'User';
    logout_textContent.textContent = 'Login';
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log('User logged out');
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
