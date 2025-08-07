// Shopify Integration for Suprimo Coffee
// This file handles the Shopify Buy Button SDK integration

// Initialize Shopify client
const shopifyConfig = {
    domain: 'qjw0s1-1s.myshopify.com', // Replace with your Shopify domain
    storefrontAccessToken: 'bce2e01a1cc90ea03378a7d13b4bd6cb', // Replace with your token
};

// Product IDs - Replace these with your actual Shopify product IDs
const PRODUCTS = {
    'goat-blend': {
        id: '7850250600547', // Replace with actual product ID
        variantId: '43565954105443' // Replace with actual variant ID
    }
};

let shopifyClient = null;
let shopifyCart = null;

// Initialize Shopify Buy SDK
async function initializeShopify() {
    try {
        console.log('🛒 Initializing Shopify integration...');
        
        // Check if ShopifyBuy SDK is loaded
        if (typeof ShopifyBuy === 'undefined') {
            console.error('❌ Shopify Buy SDK not loaded. Make sure the script is included.');
            return;
        }
        
        console.log('🔧 Using config:', {
            domain: shopifyConfig.domain,
            tokenLength: shopifyConfig.storefrontAccessToken.length
        });
        
        // Create Shopify client
        shopifyClient = ShopifyBuy.buildClient({
            domain: shopifyConfig.domain,
            storefrontAccessToken: shopifyConfig.storefrontAccessToken,
        });

        // Create or retrieve cart
        const checkoutId = localStorage.getItem('shopify_checkout_id');
        console.log('🔍 Checking for existing cart:', checkoutId);
        
        if (checkoutId) {
            try {
                console.log('📦 Fetching existing cart...');
                shopifyCart = await shopifyClient.checkout.fetch(checkoutId);
                console.log('✅ Existing cart fetched:', {
                    id: shopifyCart.id,
                    lineItems: shopifyCart.lineItems.length,
                    completed: shopifyCart.completedAt,
                    items: shopifyCart.lineItems.map(item => ({
                        title: item.title,
                        quantity: item.quantity
                    }))
                });
                
                if (shopifyCart.completedAt) {
                    console.log('🔄 Cart was completed, creating new one...');
                    shopifyCart = await shopifyClient.checkout.create();
                    localStorage.setItem('shopify_checkout_id', shopifyCart.id);
                }
            } catch (error) {
                console.warn('❌ Failed to fetch existing cart, creating new one:', error);
                shopifyCart = await shopifyClient.checkout.create();
                localStorage.setItem('shopify_checkout_id', shopifyCart.id);
            }
        } else {
            console.log('🆕 Creating new cart...');
            shopifyCart = await shopifyClient.checkout.create();
            localStorage.setItem('shopify_checkout_id', shopifyCart.id);
        }

        // Immediate UI update
        updateCartUI();
        
        console.log('🎉 Shopify integration initialized successfully', {
            cartId: shopifyCart.id,
            itemCount: shopifyCart.lineItems.length,
            totalQuantity: shopifyCart.lineItems.reduce((total, item) => total + item.quantity, 0)
        });
    } catch (error) {
        console.error('💥 Failed to initialize Shopify:', error);
    }
}

// Add product to cart
async function addToCart(productKey, quantity = 1) {
    if (!shopifyClient || !shopifyCart) {
        console.error('Shopify not initialized');
        return;
    }

    const product = PRODUCTS[productKey];
    if (!product) {
        console.error('Product not found:', productKey);
        return;
    }

    try {
        // Show loading state
        showCartLoading(true);

        // Add item to cart
        const lineItemsToAdd = [{
            variantId: product.variantId,
            quantity: quantity
        }];

        shopifyCart = await shopifyClient.checkout.addLineItems(shopifyCart.id, lineItemsToAdd);
        
        // Update UI
        updateCartUI();
        showCartNotification('Product added to cart!');
        
        // Open cart panel
        openCart();
    } catch (error) {
        console.error('Failed to add to cart:', error);
        showCartNotification('Failed to add product to cart', 'error');
    } finally {
        showCartLoading(false);
    }
}

// Remove item from cart
async function removeFromCart(lineItemId) {
    if (!shopifyClient || !shopifyCart) return;

    try {
        showCartLoading(true);
        shopifyCart = await shopifyClient.checkout.removeLineItems(shopifyCart.id, [lineItemId]);
        updateCartUI();
    } catch (error) {
        console.error('Failed to remove from cart:', error);
    } finally {
        showCartLoading(false);
    }
}

// Update quantity in cart
async function updateCartQuantity(lineItemId, quantity) {
    if (!shopifyClient || !shopifyCart) return;

    try {
        showCartLoading(true);
        const lineItemsToUpdate = [{id: lineItemId, quantity: parseInt(quantity)}];
        shopifyCart = await shopifyClient.checkout.updateLineItems(shopifyCart.id, lineItemsToUpdate);
        updateCartUI();
    } catch (error) {
        console.error('Failed to update quantity:', error);
    } finally {
        showCartLoading(false);
    }
}

// Update cart UI
function updateCartUI() {
    console.log('🔄 Updating cart UI...');
    
    if (!shopifyCart) {
        console.warn('⚠️  No shopifyCart available');
        return;
    }

    const cartContent = document.getElementById('cart-content');
    if (!cartContent) {
        console.warn('⚠️  Cart content element not found');
        return;
    }
    
    // Calculate total quantity of items in cart
    const cartCount = shopifyCart.lineItems.reduce((total, item) => total + item.quantity, 0);
    
    console.log('📊 Cart UI update:', {
        lineItems: shopifyCart.lineItems.length,
        totalQuantity: cartCount,
        items: shopifyCart.lineItems.map(item => ({
            title: item.title,
            quantity: item.quantity
        }))
    });
    
    // Update cart count badge
    updateCartBadge(cartCount);

    if (cartCount === 0) {
        cartContent.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        return;
    }

    // Build cart HTML
    let cartHTML = '<div class="cart-items">';
    
    shopifyCart.lineItems.forEach(item => {
        cartHTML += `
            <div class="cart-item" data-line-item-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.variant.image.src}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p class="cart-item-variant">${item.variant.title !== 'Default Title' ? item.variant.title : ''}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <input type="number" value="${item.quantity}" min="1" onchange="updateCartQuantity('${item.id}', this.value)">
                        <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-price">
                    <p>R ${parseFloat(item.variant.price.amount).toFixed(2)}</p>
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
                <span>R ${parseFloat(shopifyCart.subtotalPrice.amount).toFixed(2)}</span>
            </div>
            <button class="checkout-btn" onclick="checkout()">Checkout</button>
        </div>
    `;

    cartContent.innerHTML = cartHTML;
}

// Update cart badge
function updateCartBadge(count) {
    console.log('🏷️  Updating cart badge with count:', count);
    
    // Add cart count badge to navigation
    let cartBtn = document.querySelector('[data-navigate="cart"]');
    if (!cartBtn) {
        console.log('🔍 Cart button not found, creating new one...');
        // Create cart button if it doesn't exist
        const nav = document.querySelector('.primary-nav');
        if (!nav) {
            console.warn('⚠️  Primary navigation not found');
            return;
        }
        cartBtn = document.createElement('button');
        cartBtn.className = 'nav-btn';
        cartBtn.setAttribute('data-navigate', 'cart');
        cartBtn.setAttribute('aria-label', 'Shopping cart');
        cartBtn.innerHTML = 'Cart';
        nav.appendChild(cartBtn);
        console.log('✅ Cart button created');
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

// Checkout function
function checkout() {
    if (!shopifyCart || !shopifyCart.webUrl) return;
    
    // Redirect to Shopify checkout
    window.location.href = shopifyCart.webUrl;
}

// Cart UI helpers
function openCart() {
    document.getElementById('cart-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cart-overlay').classList.remove('active');
    document.body.style.overflow = '';
}

function showCartLoading(show) {
    const cartContent = document.getElementById('cart-content');
    if (show) {
        cartContent.classList.add('loading');
    } else {
        cartContent.classList.remove('loading');
    }
}

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
function initializePage() {
    // Initialize Shopify
    initializeShopify();
    
    // Force update UI after a delay to ensure cart state is loaded
    setTimeout(() => {
        if (shopifyCart) {
            updateCartUI();
        }
    }, 500);

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
    const closeCartBtn = document.querySelector('.close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target.id === 'cart-overlay') closeCart();
        });
    }

    // Add cart button click handler
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-navigate="cart"]')) {
            e.preventDefault();
            openCart();
        }
    });
}

// Try multiple ways to ensure initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// Also initialize on window load as backup
window.addEventListener('load', () => {
    if (!shopifyCart) {
        initializePage();
    }
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

    .cart-item-variant {
        color: var(--color-foam);
        font-size: 0.9rem;
        margin-bottom: var(--space-sm);
    }

    .cart-item-quantity {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
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

    /* Loading state */
    .cart-content.loading {
        opacity: 0.6;
        pointer-events: none;
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