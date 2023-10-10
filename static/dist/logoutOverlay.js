const logoutButton = document.getElementById('loginLogout');
const logout_textContent = document.getElementById('loginLogoutLink');
const userNameElement = document.getElementById('userName');

logoutButton.addEventListener('click', () => {
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
});
