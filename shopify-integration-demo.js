// Shopify Integration DEMO - Simulates cart functionality without real Shopify connection
// Replace this with shopify-integration.js once you have real credentials

// Demo products
const PRODUCTS = {
    'goat-blend': {
        id: 'demo-goat-blend',
        variantId: 'demo-goat-variant',
        title: 'The Goat Blend',
        price: 459,
        image: '/reference images/The-Goat-1.jpeg'
    },
    'majestic-blend': {
        id: 'demo-majestic-blend',
        variantId: 'demo-majestic-variant',
        title: 'Majestic Blend',
        price: 499,
        image: '/reference images/majestic-1.jpeg'
    }
};

// Demo cart storage
let demoCart = {
    items: [],
    total: 0
};

// Load cart from localStorage
function loadCart() {
    // Use the same key as app.html for consistency
    const saved = localStorage.getItem('suprimo-cart');
    if (saved) {
        const items = JSON.parse(saved);
        demoCart.items = items;
        demoCart.total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    updateCartUI();
}

// Save cart to localStorage
function saveCart() {
    // Save to both keys for compatibility
    localStorage.setItem('suprimo-cart', JSON.stringify(demoCart.items));
    localStorage.setItem('demo_cart', JSON.stringify(demoCart));
}

// Add product to cart
function addToCart(productKey, quantity = 1) {
    const product = PRODUCTS[productKey];
    if (!product) {
        console.error('Product not found:', productKey);
        return;
    }

    // Check if item already in cart
    const existingItem = demoCart.items.find(item => item.productKey === productKey);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        demoCart.items.push({
            id: Date.now().toString(), // Generate unique ID
            productKey: productKey,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    // Recalculate total
    demoCart.total = demoCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    saveCart();
    updateCartUI();
    showCartNotification(`${product.title} added to cart!`);
    openCart();
}

// Remove item from cart
function removeFromCart(itemId) {
    demoCart.items = demoCart.items.filter(item => item.id !== itemId);
    demoCart.total = demoCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    saveCart();
    updateCartUI();
}

// Update quantity in cart
function updateCartQuantity(itemId, quantity) {
    const item = demoCart.items.find(item => item.id === itemId);
    if (!item) return;
    
    quantity = parseInt(quantity);
    if (quantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    
    item.quantity = quantity;
    demoCart.total = demoCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    saveCart();
    updateCartUI();
}

// Update cart UI
function updateCartUI() {
    const cartContent = document.getElementById('cart-content');
    // Count total quantity, not just unique items
    const cartCount = demoCart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart count badge
    updateCartBadge(cartCount);

    if (cartCount === 0) {
        cartContent.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        return;
    }

    // Build cart HTML
    let cartHTML = '<div class="cart-items">';
    
    demoCart.items.forEach(item => {
        cartHTML += `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <input type="number" value="${item.quantity}" min="1" onchange="updateCartQuantity('${item.id}', this.value)">
                        <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-price">
                    <p>R ${item.price}</p>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')" aria-label="Remove item">×</button>
                </div>
            </div>
        `;
    });

    cartHTML += '</div>';
    
    // Add cart footer
    cartHTML += `
        <div class="cart-footer">
            <div class="cart-subtotal">
                <span>Subtotal:</span>
                <span>R ${demoCart.total}</span>
            </div>
            <button class="checkout-btn" onclick="checkout()">Checkout (Demo)</button>
            <p class="demo-notice">This is a demo cart. To enable real checkout, configure your Shopify credentials.</p>
        </div>
    `;

    cartContent.innerHTML = cartHTML;
}

// Update cart badge
function updateCartBadge(count) {
    let cartBtn = document.querySelector('[data-navigate="cart"]');
    if (!cartBtn) {
        // Create cart button if it doesn't exist
        const nav = document.querySelector('.primary-nav');
        cartBtn = document.createElement('button');
        cartBtn.className = 'nav-btn';
        cartBtn.setAttribute('data-navigate', 'cart');
        cartBtn.setAttribute('aria-label', 'Shopping cart');
        cartBtn.innerHTML = 'Cart';
        nav.appendChild(cartBtn);
    }

    // Remove existing badge
    const existingBadge = cartBtn.querySelector('.cart-badge');
    if (existingBadge) existingBadge.remove();

    // Add new badge if items in cart
    if (count > 0) {
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = count;
        cartBtn.appendChild(badge);
    }
}

// Demo checkout function
function checkout() {
    alert('This is a demo cart. To enable real checkout:\n\n1. Get your Shopify Storefront API credentials\n2. Update shopify-integration.js with your credentials\n3. Replace this demo file with the real integration\n\nSee SHOPIFY-SETUP.md for detailed instructions.');
}

// Cart UI helpers
function openCart() {
    const overlay = document.getElementById('cart-overlay');
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        // If cart overlay doesn't exist yet, try the app's cart
        if (window.SuprimoApp && window.SuprimoApp.openCart) {
            window.SuprimoApp.openCart();
        }
    }
}

function closeCart() {
    const overlay = document.getElementById('cart-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        // If cart overlay doesn't exist yet, try the app's cart
        if (window.SuprimoApp && window.SuprimoApp.closeCart) {
            window.SuprimoApp.closeCart();
        }
    }
}

// Make functions globally available
window.openCart = openCart;
window.closeCart = closeCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.updateCartBadge = updateCartBadge;

function showCartNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `cart-notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Load saved cart
    loadCart();
    
    // Also update badge when window loads (in case cart has items)
    setTimeout(() => {
        const savedCart = localStorage.getItem('suprimo-cart');
        if (savedCart) {
            const items = JSON.parse(savedCart);
            const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
            updateCartBadge(totalItems);
        }
    }, 100);

    // Add click handlers for existing "Add to Cart" buttons
    document.querySelectorAll('.product-card .cta-primary').forEach(button => {
        const productCard = button.closest('.product-card');
        const productKey = productCard.getAttribute('data-product');
        
        if (productKey && PRODUCTS[productKey]) {
            button.textContent = 'Add to Cart';
            button.onclick = (e) => {
                e.preventDefault();
                addToCart(productKey);
            };
        }
    });

    // Cart overlay handlers
    const closeBtn = document.querySelector('.close-cart');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCart);
    }
    
    const overlay = document.getElementById('cart-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target.id === 'cart-overlay') closeCart();
        });
    }

    // Add cart button click handler
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-navigate="cart"]') || e.target.closest('[data-navigate="cart"]')) {
            e.preventDefault();
            e.stopPropagation();
            openCart();
        }
    });
});

// Add necessary styles
const shopifyStyles = `
    <style>
    /* Cart badge */
    .cart-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background: var(--color-golden-crema);
        color: var(--color-espresso);
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 600;
    }

    [data-navigate="cart"] {
        position: relative;
    }

    /* Cart items */
    .cart-items {
        max-height: 400px;
        overflow-y: auto;
        margin-bottom: var(--space-lg);
    }

    .cart-item {
        display: flex;
        gap: var(--space-md);
        padding: var(--space-md);
        border-bottom: 1px solid rgba(212, 165, 116, 0.2);
    }

    .cart-item-image {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        overflow: hidden;
    }

    .cart-item-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .cart-item-details {
        flex: 1;
    }

    .cart-item-details h4 {
        color: var(--color-golden-crema);
        margin-bottom: var(--space-xs);
    }

    .cart-item-quantity {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        margin-top: var(--space-sm);
    }

    .quantity-btn {
        background: rgba(212, 165, 116, 0.1);
        border: 1px solid var(--color-golden-crema);
        color: var(--color-golden-crema);
        width: 30px;
        height: 30px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .quantity-btn:hover:not(:disabled) {
        background: var(--color-golden-crema);
        color: var(--color-espresso);
    }

    .quantity-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .cart-item-quantity input {
        width: 50px;
        text-align: center;
        background: transparent;
        border: 1px solid rgba(212, 165, 116, 0.3);
        color: var(--color-oat-milk);
        padding: 4px;
        border-radius: 4px;
    }

    .cart-item-price {
        text-align: right;
    }

    .cart-item-price p {
        color: var(--color-golden-crema);
        font-weight: 600;
        margin-bottom: var(--space-xs);
    }

    .remove-item {
        background: none;
        border: none;
        color: var(--color-foam);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.3s ease;
    }

    .remove-item:hover {
        color: #ff6b6b;
    }

    /* Cart footer */
    .cart-footer {
        border-top: 2px solid rgba(212, 165, 116, 0.3);
        padding-top: var(--space-lg);
    }

    .cart-subtotal {
        display: flex;
        justify-content: space-between;
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--color-golden-crema);
        margin-bottom: var(--space-lg);
    }

    .checkout-btn {
        width: 100%;
        padding: var(--space-md);
        background: var(--gradient-button);
        border: none;
        border-radius: 8px;
        color: white;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .checkout-btn:hover {
        background: var(--gradient-button-hover);
        transform: translateY(-2px);
        box-shadow: var(--shadow-lifted);
    }

    /* Empty cart */
    .empty-cart-message {
        text-align: center;
        color: var(--color-foam);
        padding: var(--space-2xl);
    }

    /* Demo notice */
    .demo-notice {
        margin-top: var(--space-md);
        font-size: 0.85rem;
        color: var(--color-foam);
        text-align: center;
        font-style: italic;
    }

    /* Notifications */
    .cart-notification {
        position: fixed;
        bottom: var(--space-lg);
        right: var(--space-lg);
        background: var(--color-secondary-bg);
        color: var(--color-oat-milk);
        padding: var(--space-md) var(--space-lg);
        border-radius: 8px;
        box-shadow: var(--shadow-lifted);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1001;
    }

    .cart-notification.show {
        transform: translateY(0);
        opacity: 1;
    }

    .cart-notification.success {
        border-left: 4px solid var(--color-golden-crema);
    }

    .cart-notification.error {
        border-left: 4px solid #ff6b6b;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .cart-panel {
            width: 100%;
            max-width: 100%;
            height: 100vh;
            border-radius: 0;
        }

        .cart-notification {
            left: var(--space-md);
            right: var(--space-md);
            bottom: var(--space-md);
        }
    }
    </style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', shopifyStyles);