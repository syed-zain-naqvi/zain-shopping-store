// script.js
const products = [
    {
        id: 1,
        name: "Wireless Noise-Cancelling Headphones",
        price: 299.99,
        originalPrice: 349.99,
        category: "electronics",
        image: " assets/wirelessheadphones.avif",
        badge: "Sale"
    },
    {
        id: 2,
        name: "Premium Leather Wallet",
        price: 89.99,
        category: "accessories",
        image: "assets/wallet.webp"
    },
    {
        id: 3,
        name: "Minimalist Watch",
        price: 199.99,
        category: "accessories",
        image: "assets/watch.webp"
    },
    {
        id: 4,
        name: "Cotton Blend Hoodie",
        price: 79.99,
        category: "clothing",
        image: "assets/hoodie.webp"
    },
    {
        id: 5,
        name: "Smart Home Speaker",
        price: 149.99,
        originalPrice: 199.99,
        category: "electronics",
        image: "assets/speaker.webp",
        badge: "Sale"
    },
    {
        id: 6,
        name: "Ceramic Plant Pot Set",
        price: 45.99,
        category: "home",
        image: "assets/plantpot.webp"
    },
    {
        id: 7,
        name: "Vintage Sunglasses",
        price: 129.99,
        category: "accessories",
        image: "assets/sunglasses.jpg"
    },
    {
        id: 8,
        name: "Organic Cotton T-Shirt",
        price: 39.99,
        category: "clothing",
        image: "assets/shirt.avif"
    },
    {
        id: 9,
        name: "Portable Bluetooth Speaker",
        price: 79.99,
        category: "electronics",
        image: "assets/bluetoothspeaker.webp"
    },
    {
        id: 10,
        name: "Scented Candle Collection",
        price: 34.99,
        category: "home",
        image: "assets/candle.avif"
    },
    {
        id: 11,
        name: "Denim Jacket",
        price: 119.99,
        category: "clothing",
        image: "assets/jacket.jpg"
    },
    {
        id: 12,
        name: "Modern Desk Lamp",
        price: 89.99,
        originalPrice: 109.99,
        category: "home",
        image: "assets/lamp.webp",
        badge: "New"
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCategory = 'all';
let searchQuery = '';

const productsGrid = document.getElementById('products-grid');
const cartItems = document.getElementById('cart-items');
const cartContainer = document.getElementById('cart-container');
const emptyCart = document.getElementById('empty-cart');
const cartCount = document.querySelector('.cart-count');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter-btn');
const navLinks = document.querySelectorAll('[data-page]');
const pages = document.querySelectorAll('.page');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileNav = document.querySelector('.mobile-nav');
const toast = document.getElementById('toast');

function init() {
    renderProducts();
    updateCartCount();
    setupEventListeners();
}

function setupEventListeners() {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderProducts();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderProducts();
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateTo(page);
        });
    });

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });

    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cart.length > 0) {
            showToast('Proceeding to checkout...');
        }
    });
}

function navigateTo(pageName) {
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(`${pageName}-page`).classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageName);
    });

    mobileMenuBtn.classList.remove('active');
    mobileNav.classList.remove('active');

    if (pageName === 'cart') {
        renderCart();
    }

    window.scrollTo(0, 0);
}

function renderProducts() {
    const filtered = products.filter(product => {
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    productsGrid.innerHTML = filtered.map(product => `
        <article class="product-card">
            <div class="product-image">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">
                    $${product.price.toFixed(2)}
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </article>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
    }
    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
}

function renderCart() {
    if (cart.length === 0) {
        cartContainer.style.display = 'none';
        emptyCart.classList.add('active');
        return;
    }

    cartContainer.style.display = 'grid';
    emptyCart.classList.remove('active');

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-category">${item.category}</p>
                <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('active', 'success');
    
    setTimeout(() => {
        toast.classList.remove('active', 'success');
    }, 3000);
}

init();
