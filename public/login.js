async function login() {
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;

    if (!userId || !password) {
        document.getElementById('login-message').innerText = 'User ID and password are required!';
        return;
    }

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, password }),
    });

    const result = await response.json();

    if (response.ok) {
        document.getElementById('login-message').innerText = result.message; // Use the response message
        setTimeout(() => {
            window.location.href = result.redirect; // Redirect to the voting page
        }, 2000);
    } else {
        document.getElementById('login-message').innerText = result.message || 'Login failed!';
    }
}

