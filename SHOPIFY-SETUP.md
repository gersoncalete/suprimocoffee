# Shopify Integration Setup Guide

## Prerequisites
1. A Shopify store with products created
2. Shopify Storefront API access
3. Product IDs and Variant IDs from your Shopify admin

## Setup Steps

### 1. Get Your Shopify Credentials

1. Log in to your Shopify admin panel
2. Go to **Settings > Apps and sales channels**
3. Click **Develop apps** (you may need to enable this first)
4. Create a new app or use existing one
5. In the app configuration:
   - Go to **API credentials** tab
   - Under **Storefront API**, click **Configure**
   - Enable the following permissions:
     - `unauthenticated_read_product_listings`
     - `unauthenticated_read_checkouts`
     - `unauthenticated_write_checkouts`
   - Save the configuration
   - Copy your **Storefront API access token**

### 2. Get Your Product IDs

1. In Shopify admin, go to **Products**
2. Click on each product (The Goat Blend, Majestic Blend)
3. In the browser URL, you'll see something like: `admin/products/1234567890`
4. The number `1234567890` is your product ID
5. To get variant IDs:
   - Use Shopify GraphQL Admin API explorer
   - Or check the page source when viewing the product

### 3. Configure the Integration

Edit the `shopify-integration.js` file and replace the placeholder values:

```javascript
// Replace with your shop domain (without https://)
const shopifyConfig = {
    domain: 'your-shop-name.myshopify.com',
    storefrontAccessToken: 'your-storefront-access-token-here',
};

// Replace with your actual product and variant IDs
const PRODUCTS = {
    'goat-blend': {
        id: 'gid://shopify/Product/YOUR_PRODUCT_ID',
        variantId: 'gid://shopify/ProductVariant/YOUR_VARIANT_ID'
    },
    'majestic-blend': {
        id: 'gid://shopify/Product/YOUR_PRODUCT_ID',
        variantId: 'gid://shopify/ProductVariant/YOUR_VARIANT_ID'
    }
};
```

### 4. Test the Integration

1. Open your site in a browser
2. Navigate to the Store page
3. Click "Add to Cart" on any product
4. Verify the cart opens with the product
5. Click "Checkout" to test the redirect to Shopify checkout

## Troubleshooting

### Cart not working?
- Check browser console for errors
- Verify your Storefront API token has correct permissions
- Ensure product/variant IDs are in the correct format

### Products not showing correct prices?
- The integration will fetch prices directly from Shopify
- Update prices in your Shopify admin

### Checkout not working?
- Verify your Shopify store is not in test mode (unless testing)
- Check that products are active and available

## Additional Customization

### Styling
The cart styles are included in the `shopify-integration.js` file. Modify the CSS variables and styles to match your brand.

### Currency
Update the currency symbol (R) in the integration file if needed.

### Product Variants
If your products have multiple variants (sizes, colors), you'll need to modify the integration to handle variant selection.

## Security Note
Never expose your Admin API key or secret. The Storefront API token is safe to use in client-side code as it only has limited, read-only permissions.