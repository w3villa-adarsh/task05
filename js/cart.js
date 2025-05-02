class CartManager {
    static initialize() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const cart = this.getCart();
            cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    static getCart() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    }

    static getTotal() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0);
    }

    static addToCart(product) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartCount();
        // Show feedback to user
        alert('Item added to cart!');
    }

    static updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) {
            this.removeFromCart(productId);
            return;
        }
        
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            this.initialize();
        }
    }

    static removeFromCart(productId) {
        const cart = this.getCart();
        const updatedCart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        this.initialize();
    }

    static clearCart() {
        localStorage.setItem('cart', '[]');
        this.initialize();
    }

    static updateCartCount() {
        const cart = this.getCart();
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = count;
        }
    }


    static updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) {
            this.removeFromCart(productId);
            return;
        }
        
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            this.initialize();
            // Add this line to refresh cart display
            updateCartDisplay();
        }
    }

    static removeFromCart(productId) {
        const cart = this.getCart();
        const updatedCart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        this.initialize();
        // Add this line to refresh cart display
        updateCartDisplay();
    }
}

// Cart display and interaction functions
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('cartTotal');
    
    if (!cartItems) return;

    const cart = CartManager.getCart();
    const totalAmount = CartManager.getTotal();

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="products.html" class="shop-now-btn">Shop Now</a>
            </div>`;
        if (subtotalElement) subtotalElement.textContent = '$0.00';
        if (totalElement) totalElement.textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <div class="cart-item-price">$${(item.currentPrice * item.quantity).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button onclick="CartManager.updateQuantity(${item.id}, ${item.quantity - 1})" class="quantity-btn minus">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="CartManager.updateQuantity(${item.id}, ${item.quantity + 1})" class="quantity-btn plus">+</button>
                </div>
            </div>
            <button onclick="CartManager.removeFromCart(${item.id})" class="remove-btn">×</button>
        </div>
    `).join('');

    if (subtotalElement) subtotalElement.textContent = `$${totalAmount.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${totalAmount.toFixed(2)}`;
}

function checkout() {
    const cart = CartManager.getCart();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = CartManager.getTotal();
    
    // Check if user is logged in
    const username = localStorage.getItem('username');
    if (!username) {
        alert('Please login to checkout');
        window.location.href = 'login.html';
        return;
    }

    try {
        const order = OrderManager.saveOrder(cart, total);
        CartManager.clearCart();
        updateCartDisplay();
        alert(`Order placed successfully! Order ID: ${order.id}`);
        window.location.href = 'orders.html';
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Failed to place order. Please try again.');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    CartManager.initialize();
    updateCartDisplay();
    
    // Add checkout button listener
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
});

// Make CartManager globally available
window.CartManager = CartManager;