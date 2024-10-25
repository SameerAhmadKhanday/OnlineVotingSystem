async function signup() {
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;

    if (!userId || !password) {
        document.getElementById('signup-message').innerText = 'User ID and password are required!';
        return;
    }

    const response = await fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, password }),
    });

    const result = await response.json();

    if (response.ok) {
        document.getElementById('signup-message').innerText = 'Signup successful! Redirecting to login...';
        setTimeout(() => {
            window.location.href = 'login.html'; // Redirect to login page after signup
        }, 2000);
    } else {
        document.getElementById('signup-message').innerText = result.message || 'Signup failed!';
    }
}
