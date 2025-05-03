class OrderManager {
    static saveOrder(items, total) {
        const orders = this.getOrders();
        const newOrder = {
            id: Date.now(),
            items: items,
            total: total,
            date: new Date().toISOString(),
            status: 'pending',
            userId: localStorage.getItem('username') || 'guest'
        };
        
        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        return newOrder;
    }

    static getOrders() {
        return JSON.parse(localStorage.getItem('orders') || '[]');
    }

    static getUserOrders(userId) {
        const orders = this.getOrders();
        return orders.filter(order => order.userId === userId);
    }

    static displayOrders() {
        const container = document.getElementById('ordersContainer');
        if (!container) return;

        const username = localStorage.getItem('username');
        if (!username) {
            container.innerHTML = '<div class="empty-orders">Please login to view your orders</div>';
            return;
        }

        try {
            const orders = this.getUserOrders(username);
            if (!orders || orders.length === 0) {
                container.innerHTML = `
                    <div class="empty-orders">
                        <p>No orders found</p>
                        <a href="products.html" class="shop-now-btn">Shop Now</a>
                    </div>`;
                return;
            }

            container.innerHTML = orders.map(order => `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <h3>Order #${order.id}</h3>
                            <p>Placed on: ${new Date(order.date).toLocaleString()}</p>
                            <p>Status: ${order.status}</p>
                        </div>
                        <div class="order-total">
                            Total: $${order.total.toFixed(2)}
                        </div>
                    </div>
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <img src="${item.image}" alt="${item.name}">
                                <div class="order-item-details">
                                    <h4>${item.name}</h4>
                                    <div class="order-item-info">
                                        <p>Quantity: ${item.quantity}</p>
                                        <p>Price per item: $${item.price.toFixed(2)}</p>
                                        <p>Subtotal: $${(item.quantity * item.price).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error displaying orders:', error);
            container.innerHTML = '<div class="error-message">Error loading orders. Please try again.</div>';
        }
    }
}

// Initialize orders display if on orders page
document.addEventListener('DOMContentLoaded', () => {
    const ordersContainer = document.getElementById('ordersContainer');
    
    // Function to fetch orders from localStorage
    function getOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        return orders;
    }

    // Function to display orders
    function displayOrders() {
        const orders = getOrders();
        
        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p>No orders found.</p>';
            return;
        }

        ordersContainer.innerHTML = orders.map(order => `
            <div class="order-item">
                <div class="order-header">
                    <div>
                        <h3>Order #${order.id}</h3>
                        <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p>Total: $${order.total.toFixed(2)}</p>
                        <p>Status: ${order.status}</p>
                    </div>
                </div>
                <div class="order-products">
                    ${order.products.map(product => `
                        <div class="order-product">
                            <img src="${product.image}" alt="${product.name}">
                            <div>
                                <h4>${product.name}</h4>
                                <p>Quantity: ${product.quantity}</p>
                                <p>Price: $${product.price.toFixed(2)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
    } else {
        displayOrders();
    }
});
