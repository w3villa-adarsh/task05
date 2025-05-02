async function fetchProducts() {
        try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        
        // Transform data to match our format
        window.products = data.map(item => ({
            id: item.id,
            name: item.title,
            brand: item.category,
            description: item.description,
            currentPrice: item.price,
            originalPrice: (item.price * 1.2).toFixed(2),
            discount: 20,
            image: item.image,
            rating: item.rating.rate,
            reviews: item.rating.count
        }));

        // Dispatch event when products are loaded
        window.dispatchEvent(new Event('productsLoaded'));
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Fetch products when the script loads
fetchProducts();
