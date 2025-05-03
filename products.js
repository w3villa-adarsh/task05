function setupFilters() {
    if (!window.products?.length) return;
    
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

    const minSlider = document.getElementById('minPriceSlider');
    const maxSlider = document.getElementById('maxPriceSlider');
    const minValue = document.getElementById('minPriceValue');
    const maxValue = document.getElementById('maxPriceValue');
    const minInput = document.getElementById('minPrice');
    const maxInput = document.getElementById('maxPrice');

    const prices = window.products.map(p => p.currentPrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    [minSlider, maxSlider].forEach(slider => {
        slider.min = minPrice;
        slider.max = maxPrice;
    });
    minSlider.value = minPrice;
    maxSlider.value = maxPrice;
    
    minInput.value = minPrice;
    maxInput.value = maxPrice;
    minValue.textContent = `$${minPrice}`;
    maxValue.textContent = `$${maxPrice}`;

    minSlider.addEventListener('input', (e) => {
        const value = Math.min(parseInt(e.target.value), parseInt(maxSlider.value) - 1);
        minSlider.value = value;
        minValue.textContent = `$${value}`;
        minInput.value = value;
        filterProducts();
    });

    maxSlider.addEventListener('input', (e) => {
        const value = Math.max(parseInt(e.target.value), parseInt(minSlider.value) + 1);
        maxSlider.value = value;
        maxValue.textContent = `$${value}`;
        maxInput.value = value;
        filterProducts();
    });

    [minInput, maxInput].forEach(input => {
        input.addEventListener('change', () => {
            const min = parseInt(minInput.value) || minPrice;
            const max = parseInt(maxInput.value) || maxPrice;
            
            if (min > max) {
                [minInput.value, maxInput.value] = [max, min];
            }
            
            minSlider.value = minInput.value;
            maxSlider.value = maxInput.value;
            minValue.textContent = `$${minInput.value}`;
            maxValue.textContent = `$${maxInput.value}`;
            filterProducts();
        });
    });
}

function filterProducts() {
    const selectedBrands = [...document.querySelectorAll('.filter-option input:checked')]
        .map(cb => cb.value);
    const minPrice = parseInt(document.getElementById('minPriceSlider').value);
    const maxPrice = parseInt(document.getElementById('maxPriceSlider').value);

    const filteredProducts = window.products.filter(product => {
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
        const priceMatch = product.currentPrice >= minPrice && product.currentPrice <= maxPrice;
        return brandMatch && priceMatch;
    });

    renderProducts(filteredProducts);
}

function renderProducts(filteredProducts = window.products) {
    const container = document.getElementById('productsContainer');
    if (!container) return;
  
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('productsContainer');
        if (container) {
            container.innerHTML = '<div class="loading">Loading products...</div>';
        }
        
        window.addEventListener('productsLoaded', () => {
            setupFilters();
            renderProducts();
            
            document.querySelectorAll('.filter-option input').forEach(checkbox => {
                checkbox.addEventListener('change', filterProducts);
            });
        });
    });
    
    

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('productsContainer');
    if (container) {
        container.innerHTML = '<div class="loading">Loading products...</div>';
    }
    
    window.addEventListener('productsLoaded', () => {
        setupFilters();
        renderProducts();
        
        document.querySelectorAll('.filter-option input').forEach(checkbox => {
            checkbox.addEventListener('change', filterProducts);
        });
    });
});

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

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('productsContainer');
    if (container) {
        container.innerHTML = '<div class="loading">Loading products...</div>';
    }
    
    window.addEventListener('productsLoaded', () => {
        setupFilters();
        renderProducts();
        
        document.querySelectorAll('.filter-option input').forEach(checkbox => {
            checkbox.addEventListener('change', filterProducts);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    console.log(3)
    const filterToggle = document.getElementById('filterToggle');
    const filterSidebar = document.getElementById('filterSidebar');
    const overlay = document.getElementById('overlay');
    const filterClose = document.querySelector('.filter-close');

    function toggleFilter() {
        filterSidebar.classList.toggle('visible');
    }

    filterToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFilter();
    });

    filterClose.addEventListener('click', toggleFilter);
    overlay.addEventListener('click', toggleFilter);

    filterSidebar.addEventListener('click', (e) => {
        e.stopPropagation();
    });

});

const resetButton = document.getElementById('resetFilters');
    
if (resetButton) {
    resetButton.addEventListener('click', function() {
        try {

            const minSlider = document.getElementById('minPriceSlider');
            const maxSlider = document.getElementById('maxPriceSlider');
            const minInput = document.getElementById('minPrice');
            const maxInput = document.getElementById('maxPrice');
            const minValue = document.getElementById('minPriceValue');
            const maxValue = document.getElementById('maxPriceValue');
            const brandCheckboxes = document.querySelectorAll('#brandFilters input[type="checkbox"]');

            if (!window.products?.length) {
                console.error('Products not loaded');
                return;
            }

            const prices = window.products.map(p => p.currentPrice);
            const minPrice = Math.floor(Math.min(...prices));
            const maxPrice = Math.ceil(Math.max(...prices));

            if (minSlider && maxSlider) {

                
                document.addEventListener('DOMContentLoaded', () => {
                    const container = document.getElementById('productsContainer');
                    if (container) {
                        container.innerHTML = '<div class="loading">Loading products...</div>';
                    }
                    
                    window.addEventListener('productsLoaded', () => {
                        setupFilters();
                        renderProducts();
                        
                        document.querySelectorAll('.filter-option input').forEach(checkbox => {
                            checkbox.addEventListener('change', filterProducts);
                        });
                    });
                });
                
                minSlider.value = minPrice;
                maxSlider.value = maxPrice;
            }

            if (minInput && maxInput) {
                minInput.value = minPrice;
                maxInput.value = maxPrice;
            }

            if (minValue && maxValue) {
                minValue.textContent = `$${minPrice}`;
                maxValue.textContent = `$${maxPrice}`;
            }

            brandCheckboxes.forEach(checkbox => checkbox.checked = false);

            filterProducts();
        } catch (error) {
            console.error('Error resetting filters:', error);
        }
    });
}