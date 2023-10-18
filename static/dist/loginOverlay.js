document.addEventListener('DOMContentLoaded', function () {
// Your Firebase-related code
const loginButton = document.getElementById('login-button');
const loginForm = document.getElementById('loginOverlay'); 
const login_Email = document.getElementById('email');
const login_Password = document.getElementById('password');
const login_TextContent = document.getElementById('loginLogoutLink');
const userNameElement = document.getElementById('userName');

const storedUserName = localStorage.getItem('userName');
if (storedUserName) {
    userNameElement.textContent = storedUserName;
    login_TextContent.textContent = "Logout";
}

loginButton.addEventListener('click', () => {
  const loginEmail = document.getElementById('email').value;
  const loginPassword = document.getElementById('password').value;
  login_Email.style.animation = 'none';
  login_Password.style.animation = 'none';

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is already authenticated; perform the necessary actions
        if (user.email) {
            const userEmail = user.email;
            let userName = userEmail.split('@')[0];
            const maxLength = 10;
            if (userName.length > maxLength) {
                userName = userName.slice(0, maxLength);
            }
            login_TextContent.textContent = 'Logout';
            userNameElement.textContent = userName;
            localStorage.setItem('userName', userName);
        }
        loginForm.style.display = 'none';
        // Optionally, you can redirect to a dashboard page or display a message.
      }
  });
  

    // User is not authenticated; proceed with sign-in
    firebase.auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL) // Set persistence to LOCAL
      .then(function() {
        return firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword);
      })
      .then((userCredential) => {
        // Login successful
        const user = userCredential.user;

        console.log('Login successful:', userCredential.email);
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
    }
  );
});
