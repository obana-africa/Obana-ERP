import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInventory } from './hooks/useInventory';
import { useInventoryFilters } from './hooks/useInventoryFilters';
import StatsRow from './components/StatsRow';
import ItemModal from './components/ItemModal';
import POModal from './components/POModal';
import PurchasOrdersTab from './components/PurchasOrdersTab';
import StockAuditTab from './components/StockAuditTab';
import ReportsTab from './components/ReportsTab';
import SuppliersTab from './components/SuppliersTab';
import RolesTab from './components/RolesTab';
import InventoryTable from './components/InventoryTable';
import Icon from '@/components/ui/Icon/Icon';
import SearchDropdown from '@/components/shared/SearchDropdown';
import { fmt } from '@/utils/formatters';
import s from './Inventory.module.css';

const LOCATIONS = [
  { id: 'loc-1', name: 'Main Store',   city: 'Lagos' },
  { id: 'loc-2', name: 'POS Outlet',   city: 'Abuja' },
  { id: 'loc-3', name: 'Warehouse',    city: 'Lagos' },
  { id: 'loc-4', name: 'POS Kiosk',    city: 'Kano' },
  { id: 'loc-5', name: 'Pop-up Store', city: 'Port Harcourt' },
];

export default function InventoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    inventory, suppliers, purchaseOrders, auditData, loading, error,
    addItem, updateItem, deleteItem, addPurchaseOrder, updateAudit,
  } = useInventory();

  const [tab, setTab] = useState('items');
  const [loc, setLoc] = useState('loc-1');
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 50); }, []);

  useEffect(() => {
    if (location.state?.openModal) {
      setModal(location.state.openModal);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const filtered = useInventoryFilters(inventory, search, statusFilter, categoryFilter);
  
  const suggestions = search.trim()
      ? inventory.filter(
        i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.sku.toLowerCase().includes(search.toLowerCase()) ||
        (i.barcode && i.barcode.includes(search))
        )
    : [];
  const totalItems = inventory.length;
  const totalValue = inventory.reduce((a, i) => a + i.costPrice * i.stock, 0);
  const lowStock = inventory.filter(i => i.stock > 0 && i.stock <= i.reorderPoint).length;
  const outOfStock = inventory.filter(i => i.stock === 0).length;
  const totalShrinkage = inventory.reduce((a, i) => a + (i.shrinkage || 0), 0);
  const categories = [...new Set(inventory.map(i => i.category))];

  const handleSaveItem = (data) => {
    if (editItem) {
      updateItem(editItem.id, data);
    } else {
      addItem(data);
    }
    setModal(null);
    setEditItem(null);
  };

  if (loading) return <div className={`${s.page} ${s.pageVisible}`}>Loading inventory…</div>;
  if (error) return <div className={`${s.page} ${s.pageVisible}`}>Error: {error}</div>;

  return (
    <div className={`${s.page} ${visible ? s.pageVisible : ''}`}>
      <header className={s.topbar}>
        <div className={s.topbarL}>
          <h1 className={s.pgTitle}>Inventory</h1>
          <div className={s.locSelector}>
            <Icon name="location" size={13} />
            <select className={s.locSelect} value={loc} onChange={e => setLoc(e.target.value)}>
              {LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name} — {l.city}</option>)}
            </select>
          </div>
        </div>
        <div className={s.topbarR}>
          <button className={s.btnOutline} onClick={() => setModal('po')}>
            <Icon name="box" size={13} /> Purchase Order
          </button>
          <button className={s.btnPrimary} onClick={() => { setEditItem(null); setModal('item'); }}>
            <Icon name="plus" size={13} /> Add Item
          </button>
        </div>
      </header>

      <div className={s.content}>
        <StatsRow
          totalItems={totalItems}
          totalValue={totalValue}
          lowStock={lowStock}
          outOfStock={outOfStock}
          totalShrinkage={totalShrinkage}
        />

        {(lowStock > 0 || outOfStock > 0) && (
          <div className={s.alertBanner}>
            <Icon name="warning" size={15} />
            <span>
              {outOfStock > 0 && <><strong>{outOfStock} item{outOfStock > 1 ? 's' : ''}</strong> out of stock. </>}
              {lowStock > 0 && <><strong>{lowStock} item{lowStock > 1 ? 's' : ''}</strong> below reorder point. </>}
              Restock soon to avoid overselling.
            </span>
            <button className={s.alertBtn} onClick={() => setModal('po')}>Create Purchase Order →</button>
          </div>
        )}

        <div className={s.tabBar}>
          <div className={s.tabs}>
            {['items','po','audit','reports','suppliers','roles'].map(t => (
              <button key={t} className={`${s.tab} ${tab === t ? s.tabOn : ''}`} onClick={() => setTab(t)}>
                {t === 'items' ? 'Item Master' : t === 'po' ? 'Purchase Orders' : t === 'audit' ? 'Stock Audit' : t === 'reports' ? 'Reports' : t === 'suppliers' ? 'Suppliers' : 'User Roles'}
              </button>
            ))}
          </div>
        </div>

        {tab === 'items' && (
  <div className={s.tableSection}>
    {/* Controls row (search + filters) */}
    <div className={s.controls}>
      <div className={s.controlsL}>
        <div className= {s.searchBox} style={{ position: 'relative' }}>
          <span className={s.searchIco}>
            <Icon name="search" size={14} />
          </span>
          <SearchDropdown
            value={search}
            onChange={setSearch}
            onSelect={(item) => {
              setSearch(item.name);
            }}
            items={suggestions}
            placeholder="Search by name, SKU, barcode…"
            renderItem={(item, index, focusedIdx, highlight, query, onClick) => (
              <div
                key={item.id}
                className={s.searchDropItem}
                style={{
                  background: index === focusedIdx ? 'var(--surface)' : 'transparent',
                }}
                onClick={onClick}
              >
                <div className={s.searchDropThumb}>{item.name[0]}</div>
                <div className={s.searchDropInfo}>
                  <div className={s.searchDropName}>{highlight(item.name, query)}</div>
                  <div className={s.searchDropMeta}>
                    {item.sku} · {item.category} · {fmt(item.price)}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    color:
                      item.status === 'out_of_stock'
                        ? '#DC2626'
                        : item.status === 'low_stock'
                        ? '#D97706'
                        : '#059669',
                  }}
                >
                  {item.stock === 0
                    ? 'Out of stock'
                    : item.stock <= item.reorderPoint
                    ? 'Low stock'
                    : 'In stock'}
                </span>
              </div>
            )}
          />
        </div>
      </div>

      <div className={s.controlsR}>
        <select
          className={s.filterSel}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
        <select
          className={s.filterSel}
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>

    {/* Inventory table – now inside the same parent */}
    <InventoryTable
      items={filtered}
      onEdit={item => {
        setEditItem(item);
        setModal('item');
      }}
      onDelete={deleteItem}
    />
  </div>
)}
        {tab === 'po' && <PurchasOrdersTab purchaseOrders={purchaseOrders} onNewPO={() => setModal('po')} />}
        {tab === 'audit' && <StockAuditTab auditData={auditData} onUpdate={updateAudit} />}
        {tab === 'reports' && <ReportsTab inventory={inventory} />}
        {tab === 'suppliers' && <SuppliersTab suppliers={suppliers} />}
        {tab === 'roles' && <RolesTab roles={roles} />}
      </div>

      {modal === 'item' && <ItemModal item={editItem} suppliers={suppliers} onClose={() => { setModal(null); setEditItem(null); }} onSave={handleSaveItem} />}
      {modal === 'po' && <POModal suppliers={suppliers} onClose={() => setModal(null)} onSave={addPurchaseOrder} />}
    </div>
  );
}