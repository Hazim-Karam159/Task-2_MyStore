let products = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 4;
const cart = [];

async function fetchProducts() {
    const response = await fetch('https://fakestoreapi.com/products');
    products = await response.json();
    filteredProducts = products;
    displayProducts();
    populateCategories();
}

function displayProducts() {
    const productContainer = document.getElementById('products');
    productContainer.innerHTML = '';

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

    productsToDisplay.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productContainer.appendChild(productDiv);
    });

    displayPagination();
}

function displayPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.disabled = true;
        }
        pageButton.onclick = () => {
            currentPage = i;
            displayProducts();
        };
        paginationContainer.appendChild(pageButton);
    }
}

function populateCategories() {
    const categories = [...new Set(products.map(product => product.category))];
    const categorySelect = document.getElementById('categories');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function applyFilters() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const selectedCategory = document.getElementById('categories').value;
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;

    filteredProducts = products.filter(product => {
        return (
            product.title.toLowerCase().includes(searchValue) &&
            (selectedCategory === '' || product.category === selectedCategory) &&
            product.price >= minPrice &&
            product.price <= maxPrice
        );
    });

    currentPage = 1;
    displayProducts();
}

function sortByPrice() {
    filteredProducts.sort((a, b) => a.price - b.price);
    displayProducts();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);

    const totalQuantity = cart.length;
    const totalPrice = cart.reduce((sum, product) => sum + product.price, 0);

    document.getElementById('totalQuantity').textContent = totalQuantity;
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);

    updateCartItems();
}

function updateCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
        const cartItem = document.createElement('p');
        cartItem.textContent = `${item.title} - $${item.price}`;
        cartItemsContainer.appendChild(cartItem);
    });
}

fetchProducts();
