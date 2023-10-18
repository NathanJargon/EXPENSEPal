const modeToggle = document.getElementById('mode-toggle');
const lightIcon = document.getElementById('light-icon');
const darkIcon = document.getElementById('dark-icon');
const body = document.body;
const container = document.getElementById('container');

function updateContainerBackground(rgbaValue) {
    const container = document.querySelector('.container');
    container.style.backgroundImage = `radial-gradient(circle at 0% 0%, ${rgbaValue} 50%, transparent 50%), 
                                       radial-gradient(circle at 100% 0%, ${rgbaValue} 50%, transparent 50%),
                                       radial-gradient(circle at 0% 100%, ${rgbaValue} 50%, transparent 50%),
                                       radial-gradient(circle at 100% 100%, ${rgbaValue} 50%, transparent 50%)`;
}


modeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    lightIcon.style.display = lightIcon.style.display === 'none' ? 'inline-block' : 'none';
    darkIcon.style.display = darkIcon.style.display === 'none' ? 'inline-block' : 'none';

    // Toggle the background color of the body
    if (body.classList.contains('dark-mode')) {
        body.style.backgroundColor = 'white';

        // Change text color to white for specific elements
        const whiteTextElements = document.querySelectorAll('.form-group, .mb-3, th, td, .container');
        whiteTextElements.forEach((element) => {
            element.style.color = 'black';
        });
        container.style.backgroundColor = '#FAF9F6';
        updateContainerBackground('rgba(0, 0, 0, 0.2)');
    } else {
        body.style.backgroundColor = 'black';

        // Change text color back to the original color for specific elements
        const originalTextElements = document.querySelectorAll('.form-group, .mb-3, th, td, .container');
        originalTextElements.forEach((element) => {
            element.style.color = ''; // Reset to the default style
        });
        container.style.backgroundColor = 'black';
        updateContainerBackground('rgba(255, 255, 255, 0.2)');
    }
});
