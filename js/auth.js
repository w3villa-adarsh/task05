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
            localStorage.setItem('isLoggedIn', 'true');
            
            const returnUrl = localStorage.getItem('returnUrl');
            window.location.href = returnUrl || './index.html';
            return true;
        }
        return false;
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
}

function isLoggedIn() {
    return !!localStorage.getItem('token') && localStorage.getItem('isLoggedIn') === 'true';
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('returnUrl');
    window.location.href = './index.html';
}

function updateHeaderAuth() {
    const userCart = document.getElementById('userCart');
    const isAuthenticated = isLoggedIn();
    const profileLink = document.querySelector('a[href="./profile.html"]');
    const ordersLink = document.querySelector('a[href="./orders.html"]');

    if (isAuthenticated) {
        userCart.innerHTML = `
            <div class="user-icon">👤 ${localStorage.getItem('username')}
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
    const currentPage = window.location.pathname;
    if (!currentPage.includes('login.html') && !currentPage.includes('signup.html')) {
        localStorage.setItem('returnUrl', currentPage);
    }
    window.location.href = './login.html';
}

function handleSignup() {
    const currentPage = window.location.pathname;
    if (!currentPage.includes('login.html') && !currentPage.includes('signup.html')) {
        localStorage.setItem('returnUrl', currentPage);
    }
    window.location.href = './signup.html';
}

function handleLogout() {
    logout();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderAuth();
});
