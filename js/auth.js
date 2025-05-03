const API_URL = 'https://fakestoreapi.com';

async function login(username, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
}

function isLoggedIn() {
    return !!localStorage.getItem('token');
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.reload();
}

function updateHeaderAuth() {
    const userCart = document.getElementById('userCart');
    const isAuthenticated = isLoggedIn();

    if (isAuthenticated) {
        userCart.innerHTML = `
            <div class="user-icon">👤
                <div class="user-popup">
                    <ul>
                        <li><a href="./profile.html">Profile</a></li>
                        <li><a href="./orders.html">Orders</a></li>
                        <li><a href="javascript:void(0)" onclick="handleLogout()">Logout</a></li>
                    </ul>
                </div>
            </div>
            <a href="./cart.html"><div class="cart-icon">🛒 <span id="cartCount">0</span></div></a>
        `;
    } else {
        userCart.innerHTML = `
            <div class="auth-content">
                <button onclick="handleLogin()" class="auth-btn login-btn">Login</button>
                <button onclick="handleSignup()" class="auth-btn signup-btn">Sign Up</button>
            </div>
        `;
    }
}

function handleLogin() {
    window.location.href = './login.html';
}

function handleSignup() {
    window.location.href = './signup.html';
}

function handleLogout() {
    logout();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderAuth();
});
