const logoutButton = document.getElementById('loginLogout');
const logout_textContent = document.getElementById('loginLogoutLink');
const userNameElement = document.getElementById('userName');

// Function to clear the userName from localStorage
function clearUserNameFromLocalStorage() {
    localStorage.removeItem('userName');
    userNameElement.textContent = 'User';
    loginLogoutLink.textContent = 'Login';
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log('User logged out');
        loginLogoutLink.textContent = 'Login';
        userNameElement.textContent = 'User';
        // Optionally, you can redirect the user to a login page or perform other actions.
    }).catch((error) => {
        // An error occurred during sign-out.
        console.error('Sign-out error:', error);
    });
}

// Start the timer when the user logs in
function startLogoutTimer() {
    timer = setTimeout(() => {
      clearUserNameFromLocalStorage();
    }, 20 * 60 * 1000); // 20 minutes in milliseconds
}

a = setTimeout(clearUserNameFromLocalStorage, 20 * 60 * 1000);
logoutButton.addEventListener('click', () => {
    if(logout_textContent.textContent === 'Logout') {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log('User logged out');
        localStorage.removeItem('userName');
        loginLogoutLink.textContent = 'Login';
        userNameElement.textContent = 'User';
        // Optionally, you can redirect the user to a login page or perform other actions.
    }).catch((error) => {
        // An error occurred during sign-out.
        console.error('Sign-out error:', error);
    });
}});

startLogoutTimer();
