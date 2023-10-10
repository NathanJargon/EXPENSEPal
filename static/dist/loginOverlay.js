document.addEventListener('DOMContentLoaded', function () {
  // Your Firebase-related code
  const loginButton = document.getElementById('login-button');
  const loginForm = document.getElementById('loginOverlay'); 
  const login_Email = document.getElementById('email');
  const login_Password = document.getElementById('password');
  const login_TextContent = document.getElementById('loginLogoutLink');

  loginButton.addEventListener('click', () => {
    const loginEmail = document.getElementById('email').value;
    const loginPassword = document.getElementById('password').value;
    login_Email.style.animation = 'none';
    login_Password.style.animation = 'none';

    // Sign in with the provided email and password
    firebase
      .auth()
      .signInWithEmailAndPassword(loginEmail, loginPassword)
      .then((userCredential) => {
        // Login successful, you can now do something with the user data
        const user = userCredential.user;
        //console.log('User:', user);

        const userNameElement = document.getElementById('userName');
        if (userCredential.email) {
          const userEmail = userCredential.email;
          //console.log(userCredential.email)
          let userName = userCredential.email.split('@')[0]; // Extract the username part
          const maxLength = 10;
          if (userName.length > maxLength) {
            userName = userName.slice(0, maxLength) + '...';
          } else {
            userName = userName;
          }
          login_TextContent.textContent = 'Logout';
          userNameElement.textContent = userName;
        }

        console.log('Login successful:', user);

        // Hide the login form after successful login
        loginForm.style.display = 'none';
      })
      .catch((error) => {
        // Handle login errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Login error:', errorCode, errorMessage);

        if (errorCode === 'auth/wrong-password') {
          // Handle incorrect password
          alert('Wrong password.');
          login_Password.style.animation = 'turnRed 1s, shake 0.5s';
        } else if (errorCode === 'auth/user-not-found') {
          // Handle user not found
          alert('User not found.');
          login_Email.style.animation = 'turnRed 1s, shake 0.5s';
        } else if (errorCode === 'auth/invalid-email') {
          // Handle invalid email
          alert('Invalid email.');
          login_Email.style.animation = 'turnRed 1s, shake 0.5s';
        }
        
      });
  });
});
