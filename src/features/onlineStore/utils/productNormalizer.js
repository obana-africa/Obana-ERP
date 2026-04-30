export const normalizeProducts = (data, platform) => {
  const normalizers = {
    obana: normalizeObanaProduct,
    shopify: normalizeShopifyProduct,
    woocommerce: normalizeWooCommerceProduct,
    generic: normalizeGenericProduct
  };

  const normalizer = normalizers[platform] || normalizers.generic;
  const products = Array.isArray(data) ? data : data?.products || [];
  
  return products.map(normalizer).filter(Boolean);
};

const normalizeObanaProduct = (product) => ({
  id: product.id || product._id,
  name: product.name || product.title,
  image: product.images?.[0]?.url || product.image || '',
  category: product.category || '',
  price: parseFloat(product.price) || 0,
  compareAt: parseFloat(product.compareAt) || null,
  rating: parseFloat(product.rating) || 0,
  reviewCount: parseInt(product.reviewCount) || 0,
  badge: product.badge || null,
  stock: parseInt(product.stock) || 0,
  variants: product.variants || [],
});

// ... other normalizers