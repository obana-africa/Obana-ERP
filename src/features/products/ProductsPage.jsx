import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProducts } from './hooks/useProducts';
import { useProductFilters } from './hooks/useProductFilters';
import ProductsStats from './components/ProductsList/ProductsStats';
import ProductsTabBar from './components/ProductsList/ProductsTabBar';
import ProductsTable from './components/ProductsList/ProductsTable';
import ProductsGrid from './components/ProductsList/ProductsGrid';
import EmptyState from './components/ProductsList/EmptyState';
import AddProductModal from './components/AddProductModal/AddProductModal';
import ImportModal from './components/ImportModal/ImportModal';
import PreviewModal from './components/PreviewModal/PreviewModal';
// import LoadingSpinner from '@/components/shared/LoadingSpinner';
// import ErrorDisplay from '@/components/shared/ErrorDisplay';
import Icon from '@/components/ui/Icon/Icon'
import s from './ProductsPage.module.css';

export default function ProductsPage() {
  const { products, loading, error, stats, addProduct, deleteProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('table');
  const [modal, setModal] = useState(null); // 'add' | 'import' | null
  const [previewProduct, setPreviewProduct] = useState(null);
  const [pageVisible, setPageVisible] = useState(false);

  const filteredProducts = useProductFilters(products, search, statusFilter, sortBy);
  const location = useLocation();
  const navigate = useNavigate();

  // Page entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setPageVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Handle programmatic modal opening from route state
  useEffect(() => {
    if (location.state?.openModal) {
      // setModal(location.state.openModal);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Event handlers
  const handleAddProduct = async (formData) => {
    try {
      await addProduct(formData);
      setModal(null);
    } catch (err) {
      console.error('Failed to add product:', err);
      // TODO: Show toast notification
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProduct(id);
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  // const handleEditProduct = (product) => {
  //   setPreviewProduct(null);
  //   // TODO: Navigate to edit page or open edit modal with product data
  //   setModal('add');
  // };

  // Loading state
  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  // Error state
  if (error) {
    return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className={`${s.page} ${pageVisible ? s.pageVisible : ''}`}>
      <main className={s.main}>
        {/* Top Bar */}
        <header className={s.topbar}>
          <div className={s.topbarLeft}>
            <h1 className={s.pageTitle}>Products</h1>
            <span className={s.productCount}>{products.length} products</span>
          </div>
          <div className={s.topbarRight}>
            {stats.lowStock > 0 && (
              <button className={s.lowStockAlert} onClick={() => setStatusFilter('low')}>
                ⚠ {stats.lowStock} low stock
              </button>
            )}
            <button className={s.btnExport}>
              <Icon name="download" size={13} /> Export
            </button>
            <button className={s.btnViewStore} onClick={() => window.open('/online-store', '_blank')}>
              <Icon name="store" size={13} /> View Store
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <ProductsStats
          stats={stats}
          onFilterByStatus={setStatusFilter}
          onNavigate={navigate}
        />

        {/* Tab Bar & Actions */}
        <ProductsTabBar
          totalProducts={products.length}
          inStockCount={products.filter(p => p.stock > 10).length}
          outOfStockCount={stats.outOfStock}
          lowStockCount={stats.lowStock}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          search={search}
          onSearchChange={setSearch}
          searchResults={products.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase())
          )}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddProduct={() => setModal('add')}
          onImport={() => setModal('import')}
        />

        {/* Content Area */}
        <div className={s.content}>
          {filteredProducts.length === 0 && !search && statusFilter === 'all' ? (
            <EmptyState
              onAdd={() => setModal('add')}
              onImport={() => setModal('import')}
            />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              type="no-results"
              searchTerm={search}
              onReset={() => {
                setSearch('');
                setStatusFilter('all');
              }}
            />
          ) : viewMode === 'table' ? (
            <ProductsTable
              products={filteredProducts}
              // onEdit={handleEditProduct}
              onPreview={setPreviewProduct}
              onDelete={handleDeleteProduct}
            />
          ) : (
            <ProductsGrid
              products={filteredProducts}
              // onEdit={handleEditProduct}
              onPreview={setPreviewProduct}
              onDelete={handleDeleteProduct}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <AddProductModal
        isOpen={modal === 'add'}
        onClose={() => setModal(null)}
        onAdd={handleAddProduct}
      />
      <ImportModal
        isOpen={modal === 'import'}
        onClose={() => setModal(null)}
      />
      <PreviewModal
        product={previewProduct}
        isOpen={!!previewProduct}
        onClose={() => setPreviewProduct(null)}
        // onEdit={handleEditProduct}
      />
    </div>
  );
}