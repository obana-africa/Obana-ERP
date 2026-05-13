import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransfers } from './hooks/useTransfers';
import { useTransferFilters } from './hooks/useTransferFilters';
import StatsRow from './components/StatsRow';
import TransfersTable from './components/TransfersTable';
import EmptyState from './components/EmptyState';
import CreateTransferModal from './components/CreateTransferModal';
import TransferDetailModal from './components/TransferDetailModal';
import Icon from '@/components/ui/Icon/Icon';
import SearchDropdown from '@/components/shared/SearchDropdown';
import { fmt } from '@/utils/formatters';
import s from './Transfers.module.css';

export default function TransfersPage() {
  const navigate = useNavigate();
  const { transfers, loading, error, addTransfer, receiveTransfer } = useTransfers();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal] = useState(null); // 'create' | 'detail'
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 50); }, []);

  const filtered = useTransferFilters(transfers, search, typeFilter, statusFilter);

  // Suggestions for search dropdown
  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return transfers.filter(tr =>
      tr.id.toLowerCase().includes(q) ||
      tr.origin.toLowerCase().includes(q) ||
      tr.dest.toLowerCase().includes(q)
    );
  }, [transfers, search]);

  // Stats
  const stats = [
    {
      label: 'Total Transfers',
      rawValue: transfers.length,
      value: transfers.length,
      accent: '#1a1a2e',
      sparkKey: 'total',
    },
    {
      label: 'In Transit',
      rawValue: transfers.filter(t => t.status === 'in_transit').length,
      value: transfers.filter(t => t.status === 'in_transit').length,
      accent: '#3B82F6',
      sparkKey: 'transit',
    },
    {
      label: 'Awaiting Action',
      rawValue: transfers.filter(t => t.status === 'pending').length,
      value: transfers.filter(t => t.status === 'pending').length,
      accent: '#F59E0B',
      sparkKey: 'pending',
    },
    {
      label: 'Completed',
      rawValue: transfers.filter(t => t.status === 'received').length,
      value: transfers.filter(t => t.status === 'received').length,
      accent: '#2DBD97',
      sparkKey: 'completed',
    },
    {
      label: 'Total Value',
      rawValue: transfers.reduce((a, tr) => a + tr.items.reduce((b, i) => b + i.exp * i.cost, 0), 0),
      value: fmt(transfers.reduce((a, tr) => a + tr.items.reduce((b, i) => b + i.exp * i.cost, 0), 0)),
      accent: '#8B5CF6',
      prefix: '₦',
      sparkKey: 'value',
    },
  ];

  const pendingCount = transfers.filter(t => t.status === 'pending').length;

  if (loading) return <div className={`${s.page} ${s.pageVisible}`}>Loading transfers…</div>;
  if (error) return <div className={`${s.page} ${s.pageVisible}`}>Error: {error}</div>;

  return (
    <div className={`${s.page} ${visible ? s.pageVisible : ''}`}>
      <header className={s.topbar}>
        <h1 className={s.pgTitle}>Transfers</h1>
        <button className={s.btnPrimary} onClick={() => setModal('create')}>
          <Icon name="plus" size={14} /> Create Transfer
        </button>
      </header>

      <div className={s.content}>
        <StatsRow stats={stats} />

        {pendingCount > 0 && (
          <div className={s.alertBanner}>
            <Icon name="warning" size={15} stroke="#B45309" />
            <span>
              <strong>{pendingCount} transfer{pendingCount > 1 ? 's' : ''}</strong> awaiting action — review and update status.
            </span>
            <button className={s.alertBtn} onClick={() => setStatusFilter('pending')}>View pending →</button>
          </div>
        )}

        <div className={s.controls}>
          <div className={s.searchBox} style={{ position: 'relative' }}>
            <span className={s.searchIco}><Icon name="search" size={14} /></span>
            <SearchDropdown
              className={s.searchInput}  
              value={search}
              onChange={setSearch}
              onSelect={(item) => setSearch(item.id)}
              items={suggestions}
              placeholder="Search by ID, origin, destination…"
              renderItem={(item, index, focusedIdx, highlight, query, onClick) => (
                <div
                  key={item.id}
                  className={s.searchDropItem}
                  style={{ background: index === focusedIdx ? 'var(--surface)' : 'transparent' }}
                  onClick={onClick}
                >
                  <div className={s.searchDropInfo}>
                    <div className={s.searchDropName}>{highlight(item.id, query)}</div>
                    <div className={s.searchDropMeta}>
                      {item.origin} → {item.dest} · {item.items.length} items
                    </div>
                  </div>
                </div>
              )}
            />
          </div>

          <div className={s.controlsR}>
            <select className={s.filterSel} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="incoming">Incoming</option>
              <option value="outgoing">Outgoing</option>
              <option value="internal">Internal</option>
            </select>
            <select className={s.filterSel} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="partial">Partial</option>
              <option value="received">Received</option>
              <option value="draft">Draft</option>
            </select>
            {(typeFilter !== 'all' || statusFilter !== 'all') && (
              <button className={s.clearBtn} onClick={() => { setTypeFilter('all'); setStatusFilter('all'); }}>Clear ×</button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            search={search}
            hasFilters={typeFilter !== 'all' || statusFilter !== 'all'}
            onClear={() => { setSearch(''); setTypeFilter('all'); setStatusFilter('all'); }}
            onCreate={() => setModal('create')}
          />
        ) : (
          <TransfersTable
            transfers={filtered}
            onSelect={transfer => { setSelectedTransfer(transfer); setModal('detail'); }}
          />
        )}

        <p className={s.countLine}>Showing {filtered.length} of {transfers.length} transfers</p>
      </div>

      {modal === 'create' && (
        <CreateTransferModal
          onClose={() => setModal(null)}
          onSave={addTransfer}
        />
      )}
      {modal === 'detail' && selectedTransfer && (
        <TransferDetailModal
          transfer={selectedTransfer}
          onClose={() => { setModal(null); setSelectedTransfer(null); }}
          onReceive={receiveTransfer}
        />
      )}
    </div>
  );
}