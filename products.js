function setupFilters() {
    if (!window.products?.length) return;
    
    // Setup brand filters
    const brands = [...new Set(window.products.map(p => p.brand))].sort();
    const brandFilters = document.getElementById('brandFilters');
    
    if (brandFilters) {
        brandFilters.innerHTML = brands.map(brand => `
            <label class="filter-option">
                <input type="checkbox" value="${brand}">
                <span>${brand}</span>
                <span class="count">(${window.products.filter(p => p.brand === brand).length})</span>
            </label>
        `).join('');
    }

    // Setup price filter
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    if (priceRange && priceValue) {
        const maxPrice = Math.ceil(Math.max(...window.products.map(p => p.currentPrice)));
        priceRange.max = maxPrice;
        priceRange.value = maxPrice;
        priceValue.textContent = `$${maxPrice}`;

        priceRange.addEventListener('input', (e) => {
            priceValue.textContent = `$${e.target.value}`;
            filterProducts();
        });
    }
}

function filterProducts() {
    const selectedBrands = [...document.querySelectorAll('.filter-option input:checked')]
        .map(cb => cb.value);
    const maxPrice = Number(document.getElementById('priceRange').value);

    const filteredProducts = window.products.filter(product => {
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
        const priceMatch = product.currentPrice <= maxPrice;
        return brandMatch && priceMatch;
    });

    renderProducts(filteredProducts);
}

function renderProducts(filteredProducts = window.products) {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    if (!filteredProducts || filteredProducts.length === 0) {
        container.innerHTML = '<div class="no-products">No products found</div>';
        return;
    }

    const productsHTML = filteredProducts.map(product => `
        <div class="product-item">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-details">
                <h2>${product.name}</h2>
                <p class="brand">${product.brand}</p>
                <p class="description">${product.description}</p>
                <div class="price-section">
                    <span class="current-price">$${product.currentPrice}</span>
                    <span class="original-price">$${product.originalPrice}</span>
                    <span class="discount">-${product.discount}%</span>
                </div>
                <div class="rating">
                    <span class="stars">⭐${product.rating}</span>
                    <span class="reviews">(${product.reviews} reviews)</span>
                </div>
                <button class="add-to-cart" onclick='CartManager.addToCart(${JSON.stringify(product).replace(/'/g, "&apos;")})'>
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');

    container.innerHTML = productsHTML;
}

// Update event listeners
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('productsContainer');
    if (container) {
        container.innerHTML = '<div class="loading">Loading products...</div>';
    }
    
    window.addEventListener('productsLoaded', () => {
        setupFilters();
        renderProducts();
        
        // Add filter event listeners
        document.querySelectorAll('.filter-option input').forEach(checkbox => {
            checkbox.addEventListener('change', filterProducts);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const filterToggle = document.getElementById('filterToggle');
    const filterSidebar = document.getElementById('filterSidebar');
    const overlay = document.getElementById('overlay');
    const filterClose = document.querySelector('.filter-close');

    function toggleFilter() {
        filterSidebar.classList.toggle('visible');
        overlay.classList.toggle('visible');
    }

    filterToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFilter();
    });

    filterClose.addEventListener('click', toggleFilter);
    overlay.addEventListener('click', toggleFilter);

    // Prevent clicks inside sidebar from closing it
    filterSidebar.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});
