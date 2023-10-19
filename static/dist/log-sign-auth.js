const loginOverlay = document.getElementById('loginOverlay');
const loginLogoutLink = document.getElementById('loginLogoutLink');
const closeOverlayButton = document.getElementById('closeOverlay');
const signUpClose = document.getElementById('closeSignUpOverlay');
const signupOverlay = document.getElementById('signupOverlay');
const signupLink = document.getElementById('signupLink');

loginLogoutLink.addEventListener('click', () => {
    loginOverlay.style.display = 'block';
});

signupLink.addEventListener('click', () => {
    if (loginOverlay.style.display === 'block') {
        loginOverlay.style.display = 'none';
        signupOverlay.style.display = 'block';
    } else {
        loginOverlay.style.display = 'block';
        signupOverlay.style.display = 'none';
    }
});

closeOverlayButton.addEventListener('click', () => {
        loginOverlay.style.display = 'none';
});

signUpClose.addEventListener('click', () => {
    signupOverlay.style.display = 'none';
});
