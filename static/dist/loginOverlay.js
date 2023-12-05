document.addEventListener('DOMContentLoaded', function () {
<<<<<<< HEAD
  const expenseForm = document.getElementById('expense-form');
  const loginButton = document.getElementById('login-button');
  const loginForm = document.getElementById('loginOverlay'); 
  const login_Email = document.getElementById('email');
  const login_Password = document.getElementById('password');
  const login_TextContent = document.getElementById('loginLogoutLink');
  const userNameElement = document.getElementById('userName');

  if (expenseForm) {
    expenseForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const description = document.querySelector('input[name="description"]').value;
      const amount = document.querySelector('input[name="amount"]').value;
      const date = document.querySelector('input[name="date"]').value;
      const category = document.querySelector('input[name="category"]').value;

      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          user.getIdToken()
            .then(function (idToken) {
              // Log the ID token to the console
              const id_Token = idToken;
              document.cookie = 'your_firebase_cookie_name=' + id_Token;

              const expenseData = {
                description,
                amount,
                date,
                category,
                idToken: id_Token,
              };

              fetch('/add_expense', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + id_Token,
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
            })
            .catch(function (error) {
              console.error('Error getting ID token:', error);
            });

          if (user.email) {
            const userEmail = user.email;
            let userName = userEmail.split('@')[0].slice(0, 5).toUpperCase();
            login_TextContent.textContent = 'Logout';
            userNameElement.textContent = userName;
            localStorage.setItem('userName', userName);
          }
          loginForm.style.display = 'none';
        }
      });
    });
  }

  if (loginButton) {
    loginButton.addEventListener('click', () => {
      const loginEmail = login_Email.value;
      const loginPassword = login_Password.value;

      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          user.getIdToken()
            .then(function (idToken) {
              // Log the ID token to the console
              const id_Token = idToken;
              document.cookie = 'your_firebase_cookie_name=' + id_Token;

              const expenseData = {
                description: 'Expense description',
                amount: 50.0,
                date: '2023-10-13',
                category: 'Category',
                uid: user.uid,
                idToken: id_Token,
              };
              
              /*
              fetch('/add_expense', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + id_Token,
                },
                body: JSON.stringify(expenseData),
              })
              .then(response => {
                if (response.status === 200) {
                  return response.json();
                } else {
                  throw new Error('Request failed with status: ' + response.status);
                }
              })
              .then(data => {
                console.log('Response from server:', data);
              })
              .catch(error => {
                console.error('Error:', error);
              });
            })
            .catch(function (error) {
              console.error('Error getting ID token:', error);
          */
         
            });
            

          /*if (user.email) {
            const userEmail = user.email;
            let userName = userEmail.split('@')[0].slice(0, 5).toUpperCase();
            login_TextContent.textContent = 'Logout';
            userNameElement.textContent = userName;
            localStorage.setItem('userName', userName);
          }
          loginForm.style.display = 'none';*/
        }
      });

      firebase.auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
          return firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword);
        })
        .then((userCredential) => {
          const user = userCredential.user;
          console.log('Login successful:', userCredential.email);
          loginForm.style.display = 'none';
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error('Login error:', errorCode, errorMessage);

          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
            login_Password.style.animation = 'turnRed 1s, shake 0.5s';
          } else if (errorCode === 'auth/internal-error') {
            alert('Internal Error.');
            login_Password.style.animation = 'turnRed 1s, shake 0.5s';
          } else if (errorCode === 'auth/user-not-found') {
            alert('User not found.');
            login_Email.style.animation = 'turnRed 1s, shake 0.5s';
          } else if (errorCode === 'auth/invalid-email') {
            alert('Invalid email.');
            login_Email.style.animation = 'turnRed 1s, shake 0.5s';
          }
        });
    });
  }

=======
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
              const id_Token = idToken;
              document.cookie = 'your_firebase_cookie_name=' + id_Token;

              const expenseData = {
                description: 'Expense description',
                amount: 50.0,
                date: '2023-10-13',
                category: 'Category',
                uid: user.uid,
                idToken: id_Token,
              };
              
              /*
              fetch('/add_expense', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + id_Token,
                },
                body: JSON.stringify(expenseData),
              })
              .then(response => {
                if (response.status === 200) {
                  return response.json();
                } else {
                  throw new Error('Request failed with status: ' + response.status);
                }
              })
              .then(data => {
                console.log('Response from server:', data);
              })
              .catch(error => {
                console.error('Error:', error);
              });
            })
            .catch(function (error) {
              console.error('Error getting ID token:', error);
          */
         
            });
            

          /*if (user.email) {
            const userEmail = user.email;
            let userName = userEmail.split('@')[0].slice(0, 5).toUpperCase();
            login_TextContent.textContent = 'Logout';
            userNameElement.textContent = userName;
            localStorage.setItem('userName', userName);
          }
          loginForm.style.display = 'none';*/
        }
      });

      firebase.auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
          return firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword);
        })
        .then((userCredential) => {
          const user = userCredential.user;
          console.log('Login successful:', userCredential.email);
          loginForm.style.display = 'none';
        })
        .catch((error) => {
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
