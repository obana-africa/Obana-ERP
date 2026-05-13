import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/Icon/Icon';
import { useCollections } from './hooks/useCollections';
import { useCollectionFilters } from './hooks/useCollectionFilters';
import StatsRow from './components/StatsRow';
import TabBar from './components/TabBar';
import CollectionCard from './components/CollectionCard';
import LocationsOverview from './components/LocationsOverview';
import EmptyState from './components/EmptyState';
import CollectionModal from './modals/CollectionModal';
import InventoryModal from './modals/InventoryModal';
import LocationsModal from './modals/LocationsModal';
import { LOCATIONS } from '@/data/collections';
import CollectionGrid from './components/CollectionGrid';
import s from './Collections.module.css';

export default function CollectionsPage() {
  const navigate = useNavigate();
  const {
    collections, loading, error,
    addCollection, updateCollection, deleteCollection, saveInventory,
  } = useCollections();

  const [modal, setModal] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [invTarget, setInvTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('collections');
  const [sortBy, setSortBy] = useState('name');
  const [toast, setToast] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => { 
    if (!toast) return; const t = setTimeout(() => setToast(null), 3000); 
    return () => clearTimeout(t); }, [toast]);
  useEffect(() => {
  const t = setTimeout(() => setVisible(true), 50);
  return () => clearTimeout(t);
}, []);
  const filtered = useCollectionFilters(collections, search, statusFilter, sortBy);

  // Stats
  const totalProducts = [...new Set(collections.flatMap(c => c.productIds))].length;
  const activeLocations = LOCATIONS.filter(l => l.active).length;
  const totalStock = collections.reduce((a, c) =>
    a + Object.values(c.locationInventory).reduce((b, loc) =>
      b + Object.values(loc).reduce((d, q) => d + q, 0), 0), 0);
  const lowStockAlerts = collections.reduce((a, c) => {
    let count = 0;
    c.productIds.forEach(pid => {
      LOCATIONS.filter(l => l.active).forEach(l => {
        const q = c.locationInventory[l.id]?.[pid] ?? 0;
        if (q > 0 && q <= 5) count++;
      });
    });
    return a + count;
  }, 0);

  const stats = { totalCollections: collections.length, totalProducts, activeLocations, totalStock, lowStockAlerts };

  // Handlers
  const handleSaveCollection = async (data) => {
    if (editTarget) {
      await updateCollection(editTarget.id, data);
      showToast('Collection updated');
    } else {
      await addCollection(data);
      showToast('Collection created');
    }
    setModal(null); setEditTarget(null);
  };

  const handleSaveInventory = async (newInventory) => {
    await saveInventory(invTarget.id, newInventory);
    setInvTarget(null);
    showToast('Inventory saved');
  };

  const handleDelete = async (id) => {
    await deleteCollection(id);
    showToast('Collection deleted', 'error');
  };

  const showToast = (msg, type = 'success') => setToast({ msg, type });

    if (loading) return <div className={`${s.page} ${s.pageVisible}`}><p>Loading collections…</p></div>;
    if (error) return <div className={`${s.page} ${s.pageVisible}`}><p>Error: {error}</p></div>;
  return (
    <div className={`${s.page} ${visible ? s.pageVisible : ''}`}>
      {toast && (
        <div className={`${s.toast} ${toast.type === 'error' ? s.toastError : ''}`}>
          {toast.msg}
        </div>
      )}
      <header className={s.topbar}>
        <div>
          <h1 className={s.pgTitle}>Collections</h1>
          <p className={s.pgSub}>Organise products by theme, season, or channel</p>
        </div>
        <div className={s.topbarR}>
          <button className={s.btnOutline} onClick={() => navigate('/inventory')}>
            <Icon name="box" size={14} /> Inventory
          </button>
          <button className={s.btnOutline} onClick={() => setModal('locations')}>
            <Icon name="location" size={14} /> Manage Locations
          </button>
          <button className={s.btnPrimary} onClick={() => { setEditTarget(null); setModal('collection'); }}>
            <Icon name="plus" size={14} stroke="#fff" /> Create Collection
          </button>
        </div>
      </header>

      <div className={s.content}>
        <StatsRow stats={stats} onFilterByStatus={setStatusFilter} onNavigate={navigate} />

        {lowStockAlerts > 0 && (
          <div className={s.alertBanner} onClick={() => navigate('/inventory')}>
            <Icon name="warning" size={15} stroke="#B45309" />
            <span><strong>{lowStockAlerts} product–location combination{lowStockAlerts > 1 ? 's' : ''}</strong> running low on stock.</span>
            <span className={s.alertLink}>View inventory →</span>
          </div>
        )}

        <TabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          collections={collections}
          totalCollections={collections.length}
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onSelectCollection={id => {
            const col = collections.find(c => c.id === id);
            if (col) { setEditTarget(col); setModal('collection'); }
          }}
          onSelectProduct={id => navigate('/products', { state: { highlight: id } })}
        />

        {activeTab === 'collections' && (
          filtered.length === 0 ? (
            <EmptyState
              search={search}
              onClearSearch={() => setSearch('')}
              onCreate={() => { setEditTarget(null); setModal('collection'); }}
            />
          ) : (
            <div className={s.collGrid}>
              {filtered.map((c, i) => (
                <CollectionCard
                  key={c.id}
                  collection={c}
                  style={{ animationDelay: `${i * 50}ms` }}
                  onEdit={col => { setEditTarget(col); setModal('collection'); }}
                  onDelete={handleDelete}
                  onManageInventory={col => { setInvTarget(col); setModal('inventory'); }}
                  onViewProducts={col => navigate('/products', { state: { collection: col.id } })}
                />
              ))}
              <button className={s.addCollCard} onClick={() => { setEditTarget(null); setModal('collection'); }}>
                <Icon name="plus" size={22} />
                <span>New Collection</span>
              </button>
            </div>
          )
        )}

        {activeTab === 'locations' && (
          <LocationsOverview
            collections={collections}
            onManageLocations={() => setModal('locations')}
            navigate={navigate}
          />
        )}
      </div>

      {modal === 'collection' && (
        <CollectionModal
          collection={editTarget}
          onClose={() => { setModal(null); setEditTarget(null); }}
          onSave={handleSaveCollection}
        />
      )}
      {modal === 'inventory' && invTarget && (
        <InventoryModal
          collection={invTarget}
          onClose={() => { setModal(null); setInvTarget(null); }}
          onSave={handleSaveInventory}
        />
      )}
      {modal === 'locations' && <LocationsModal onClose={() => setModal(null)} />}
    </div>
  );
}