document.addEventListener('DOMContentLoaded', function () {
// Your Firebase-related code
const loginButton = document.getElementById('login-button');
const loginForm = document.getElementById('loginOverlay'); 
const login_Email = document.getElementById('email');
const login_Password = document.getElementById('password');
const login_TextContent = document.getElementById('loginLogoutLink');
const userNameElement = document.getElementById('userName');
var user = firebase.auth().currentUser;
var id_Token;
var timeoutID;

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
})};

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      // Tab became invisible (user switched tabs or minimized the browser)
      // Set a timeout to log out after 20 minutes
      timeoutID = setTimeout(clearUserNameFromLocalStorage, 20 * 60 * 1000);
    } else {
      // Tab became visible
      // Clear the timeout if the tab is visible again
      clearTimeout(timeoutID);
    }
  });

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
      user.getIdToken()
        .then(function (idToken) {
          // Log the ID token to the console
          id_Token = idToken;
          document.cookie = 'your_firebase_cookie_name=' + id_Token;

          // Example expense data
          const expenseData = {
            description: 'Expense description',
            amount: 50.0,
            date: '2023-10-13',
            category: 'Category',
            uid: user.uid,
            idToken: id_Token, // Now idToken is defined
          };

          // Include the UID in the request headers
          fetch('/add_expense', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + id_Token, // Use idToken from this scope
            },
            body: JSON.stringify(expenseData), // Send the expense data as JSON
          })
            .then(response => {
              if (response.status === 200) {
                // Request was successful
                return response.json();
              } else {
                throw new Error('Request failed with status: ' + response.status);
              }
            })
            .then(data => {
              // Handle the response from your Flask server
              console.log('Response from server:', data);
            })
            .catch(error => {
              // Handle any errors
              console.error('Error:', error);
            });
        })
        .catch(function (error) {
          // Handle errors, such as the user not being authenticated
          console.error('Error getting ID token:', error);
        });


      if (user.email) {
          const userEmail = user.email;
          let userName = userEmail.split('@')[0].slice(0,5).toUpperCase();
          login_TextContent.textContent = 'Logout';
          userNameElement.textContent = userName;
          localStorage.setItem('userName', userName);

          setTimeout(clearUserNameFromLocalStorage, 20 * 60 * 1000);
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
        } else if (errorCode === 'auth/internal-error') {
          // Handle incorrect password
          alert('Internal Error.');
          login_Password.style.animation = 'turnRed 1s, shake 0.5s';
        }else if (errorCode === 'auth/user-not-found') {
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
