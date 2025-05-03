// Remove the products array from here since it's now in productData.js

function generateStars(rating) {
    let stars = '';
    for(let i = 1; i <= 5; i++) {
        stars += `<span class="${i <= rating ? 'star' : 'star-empty'}">${i <= rating ? '★' : '☆'}</span>`;
    }
    return stars;
}

function renderProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    const featuredProducts = window.products?.filter(p => p.featured) || [];
    
    if (featuredProducts.length === 0) {
        container.innerHTML = '<div class="loading">Loading products...</div>';
        return;
    }

    const productsHTML = featuredProducts.map(product => `
        <div class="card">
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
                <div class="discount-tag">-${product.discount}%</div>
                <div class="wishlist">❤️</div>
            </div>
            <div class="product-info">
                <div class="brand">${product.brand}</div>
                <h2 class="product-name">${product.name}</h2>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span class="rating-count">(${product.reviews} reviews)</span>
                </div>
                <p class="product-description">${product.description}</p>
                <div class="price-section">
                    <span class="current-price">$${product.currentPrice.toFixed(2)}</span>
                    <span class="original-price">$${product.originalPrice}</span>
                </div>
                <div class="button-group">
                    <button class="add-to-cart" onclick='CartManager.addToCart(${JSON.stringify(product).replace(/'/g, "&apos;")})'>Add to Cart</button>
                    <button class="rate-product" onclick="showRatingModal(${product.id})">Rate Product</button>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = productsHTML;
}

// Update event listener to wait for products
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(); // Show loading state initially
    
    // Listen for products loaded event
    window.addEventListener('productsLoaded', () => {
        renderProducts();
    });
});

let cart = [];
loadCartFromStorage();

// Cart functionality
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    cart = savedCart ? JSON.parse(savedCart) : [];
    updateCartCount();
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

function addToCart(productId) {
    const product = window.products.find(p => p.id === productId);
    if (!product) return;
    
    CartManager.addToCart(product);
    alert('Product added to cart!');
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
                <div>
                    <span>${item.name}</span>
                    <div>Qty: ${item.quantity} × $${item.price.toFixed(2)}</div>
                </div>
                <div>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    <button onclick="removeFromCart('${item.id}')" style="margin-left: 10px;">×</button>
                </div>
            </div>
        `;
    });

    document.getElementById('cartTotal').textContent = total.toFixed(2);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartDisplay();
}

document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const productCards = document.querySelectorAll('.card');
    console.log('method executed')
    productCards.forEach(card => {
        const productName = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
        const productBrand = card.querySelector('.brand')?.textContent.toLowerCase() || '';
        const productDescription = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
        
        if (productName.includes(searchTerm) || 
            productBrand.includes(searchTerm) || 
            productDescription.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});


document.getElementById('cartIcon')?.addEventListener('click', () => {
    window.location.href = 'cart.html';
});


document.getElementById('checkoutBtn').addEventListener('click', () => {
    alert('Thank you for your purchase!');
    cart = [];
    saveCartToStorage();
    updateCartDisplay();
    document.getElementById('cartModal').style.display = 'none';
});

let currentProductToRate = null;

function showRatingModal(productName) {
    const product = products.find(p => p.name === productName);
    if (!product) return;

    currentProductToRate = product;
    const modal = document.getElementById('ratingModal');
    const productImage = document.getElementById('rateProductImage');
    const productName = document.getElementById('rateProductName');

    productImage.src = product.image;
    productName.textContent = product.name;
    modal.style.display = 'flex';

    document.querySelectorAll('.rating-stars .star').forEach(star => {
        star.classList.remove('active');
        star.textContent = '☆';
    });
    document.getElementById('reviewText').value = '';
}

document.querySelectorAll('.rating-stars .star').forEach(star => {
    star.addEventListener('mouseover', function() {
        const rating = this.dataset.rating;
        updateStars(rating);
    });

    star.addEventListener('click', function() {
        const rating = this.dataset.rating;
        document.querySelectorAll('.rating-stars .star').forEach(s => {
            if (s.dataset.rating <= rating) {
                s.textContent = '★';
            }
        });
    });
});

document.querySelector('.rating-stars').addEventListener('mouseout', function() {
    document.querySelectorAll('.rating-stars .star').forEach(star => {
        if (star.textContent !== '★') {
            star.textContent = '☆';
        }
    });
});

function updateStars(rating) {
    document.querySelectorAll('.rating-stars .star').forEach(star => {
        star.textContent = star.dataset.rating <= rating ? '★' : '☆';
    });
}

document.getElementById('submitRating').addEventListener('click', function() {
    const rating = document.querySelectorAll('.rating-stars .star[data-rating]').length;
    const review = document.getElementById('reviewText').value;
    
    alert(`Thank you for rating ${currentProductToRate.name}!\nRating: ${rating}/5\nReview: ${review}`);
    
    document.getElementById('ratingModal').style.display = 'none';
});

document.getElementById('closeRating').addEventListener('click', function() {
    document.getElementById('ratingModal').style.display = 'none';
});


document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (!window.products) {
        const cachedProducts = localStorage.getItem('products');
        if (cachedProducts) {
            window.products = JSON.parse(cachedProducts);
            renderProducts();
        }
    }
});



document.addEventListener("DOMContentLoaded", () => {
    const userIcon = document.getElementById("userIcon");
    const userPopup = document.getElementById("userPopup");

    userIcon.addEventListener("click", () => {
        console.log('clicked')
        userPopup.classList.toggle("active");
    });

    document.addEventListener("click", (event) => {
        console.log('clicked')
        if (!userIcon.contains(event.target) && !userPopup.contains(event.target)) {
            userPopup.classList.remove("active");
        }
    });
});

