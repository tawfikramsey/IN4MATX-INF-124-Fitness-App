// File: scripts/main.js or scripts/login.js

document.addEventListener('DOMContentLoaded', (event) => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validate input fields here if necessary

        // Proceed with the login process
        loginUser(email, password);
    });
});

function loginUser(email, password) {
    // Example: Send data to the server using the Fetch API
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Any other headers your API needs
        },
        body: JSON.stringify({
            email: email,
            password: password
        }),
    })
    .then(response => response.json())
    .then(data => {
        // Handle response data
        console.log(data);
        if(data.success) {
            // Redirect to user dashboard or other page
            window.location.href = '/dashboard';
        } else {
            // Display an error message
            alert('Login failed: ' + data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
