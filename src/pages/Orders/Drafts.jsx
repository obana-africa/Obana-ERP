import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './Drafts.module.css'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const SEED = [
  { id:'D125', date:'23 Feb at 8:05',   customer:'No customer',            status:'open',      total:26875    },
  { id:'D124', date:'13 Feb at 10:39',  customer:'Ozioma',                 status:'completed', total:50500    },
  { id:'D122', date:'26 Dec at 20:46',  customer:'Ayo Alfred',             status:'open',      total:205100   },
  { id:'D123', date:'26 Dec at 20:45',  customer:'Ayo Alfred',             status:'open',      total:50000    },
  { id:'D121', date:'26 Dec at 20:32',  customer:'Ochije Nnani',           status:'completed', total:48000    },
  { id:'D117', date:'26 Dec at 20:30',  customer:'Ochije Nnani',           status:'open',      total:650      },
  { id:'D31',  date:'26 Dec at 20:30',  customer:'Ochije Nnani',           status:'open',      total:513800   },
  { id:'D120', date:'25 Sept at 12:41', customer:'OBANA',                  status:'open',      total:55000    },
  { id:'D119', date:'23 Sept at 19:08', customer:'Emmanuel Ogheneware',    status:'completed', total:15000    },
  { id:'D118', date:'18 Sept at 14:08', customer:'Mrs Troworths Store',    status:'completed', total:360000   },
  { id:'D116', date:'7 Jul at 16:53',   customer:'Spar Ilupeju',           status:'completed', total:769302   },
  { id:'D115', date:'7 Jul at 16:39',   customer:'Spar AO',                status:'completed', total:691000   },
  { id:'D114', date:'7 Jul at 12:46',   customer:'Spar Enugu mall',        status:'completed', total:165000   },
  { id:'D113', date:'7 Jul at 12:37',   customer:'Spar Calabar Mall',      status:'completed', total:201801   },
  { id:'D112', date:'7 Jul at 12:24',   customer:'Spar WUSE',              status:'completed', total:38400    },
  { id:'D111', date:'4 Jul at 9:43',    customer:'Folarin Adebusola-Quad', status:'open',      total:23500    },
  { id:'D110', date:'3 Jul at 15:55',   customer:'FOODCO Ikoyi',           status:'completed', total:58245    },
  { id:'D109', date:'3 Jul at 13:49',   customer:'FOODCO Lekki',           status:'completed', total:69230    },
  { id:'D108', date:'3 Jul at 12:44',   customer:'FOODCO ABEOKUTA',        status:'completed', total:31255    },
  { id:'D107', date:'3 Jul at 12:28',   customer:'FOODCO Ikotun',          status:'completed', total:70685    },
  { id:'D106', date:'1 Jul at 18:04',   customer:'FOODCO Ibadan',          status:'completed', total:1578675  },
  { id:'D105', date:'14 Jun at 16:13',  customer:'FOODCO Ibadan',          status:'completed', total:1644625  },
  { id:'D104', date:'14 Jun at 15:31',  customer:'Spar Opebi',             status:'completed', total:1034000  },
]

const fmt = n => `₦${Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const StatusPill = ({ status }) =>
  status === 'open'
    ? <span className={s.pillOpen}><span className={s.pillDot} />Open</span>
    : <span className={s.pillCompleted}>Completed</span>

function CreateModal({ onClose, onCreate }) {
  const [customer, setCustomer] = useState('')
  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.modalHead}>
          <h2 className={s.modalTitle}>Create order</h2>
          <button className={s.modalClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>
        <div className={s.modalBody}>
          <div className={s.field}>
            <label className={s.label}>Customer <span className={s.opt}>(optional)</span></label>
            <input className={s.input} placeholder="Search customers…"
              value={customer} onChange={e => setCustomer(e.target.value)} autoFocus />
          </div>
          <p className={s.modalHint}>You can add products, pricing, and shipping details after creating the draft.</p>
        </div>
        <div className={s.modalFoot}>
          <button className={s.btnGhost} onClick={onClose}>Cancel</button>
          <button className={s.btnPrimary}
            onClick={() => { onCreate(customer || 'No customer'); onClose() }}>
            Create order
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Drafts() {
  const navigate = useNavigate()
  const [orders,    setOrders]    = useState(SEED)
  const [search,    setSearch]    = useState('')
  const [filter,    setFilter]    = useState('All')
  const [selected,  setSelected]  = useState([])
  const [showModal, setShowModal] = useState(false)
  const [visible,   setVisible]   = useState(false)
  const [sortDir,   setSortDir]   = useState('desc')
  const [page,      setPage]      = useState(1)
  const PER_PAGE = 50

  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  const filtered = orders
    .filter(o => {
      const q = search.toLowerCase()
      return o.customer.toLowerCase().includes(q) || `#${o.id}`.toLowerCase().includes(q) || o.date.toLowerCase().includes(q)
    })
    .filter(o => filter === 'All' ? true : o.status === filter.toLowerCase())

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const openCount  = orders.filter(o => o.status === 'open').length
  const totalValue = orders.reduce((a, o) => a + o.total, 0)

  const toggleSelect = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const toggleAll    = () => setSelected(s => s.length === paginated.length ? [] : paginated.map(o => o.id))

  const createOrder = customer => {
    const d = new Date()
    setOrders(prev => [{
      id: `D${prev.length + 1}`,
      date: `${d.getDate()} ${d.toLocaleString('en',{month:'short'})} at ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`,
      customer, status: 'open', total: 0,
    }, ...prev])
  }

  const deleteSelected = () => {
    if (window.confirm(`Delete ${selected.length} draft order(s)?`)) {
      setOrders(prev => prev.filter(o => !selected.includes(o.id)))
      setSelected([])
    }
  }

  return (
    <div className={`${s.page} ${visible ? s.visible : ''}`}>

      {/* Header */}
      <div className={s.header}>
        <div className={s.headerLeft}>
          <button className={s.breadBack} onClick={() => navigate('/orders')}>
            <Ic d="M19 12H5M12 5l-7 7 7 7" size={14} />
          </button>
          <div className={s.titleIconWrap}>
            <Ic d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" size={16} stroke="#1b3b5f" />
          </div>
          <h1 className={s.title}>Drafts</h1>
        </div>
        <div className={s.headerRight}>
          <button className={s.btnOutline}>
            <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" size={13} />
            Export
          </button>
          <button className={s.btnOutline}>
            More actions <Ic d="M6 9l6 6 6-6" size={13} />
          </button>
          <button className={s.btnPrimary} onClick={() => setShowModal(true)}>
            Create order
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={s.statsStrip}>
        <div className={s.statItem}>
          <span className={s.statVal}>{orders.length}</span>
          <span className={s.statLbl}>Total drafts</span>
        </div>
        <div className={s.statDivider} />
        <div className={s.statItem}>
          <span className={s.statVal} style={{ color:'#E8C547' }}>{openCount}</span>
          <span className={s.statLbl}>Open</span>
        </div>
        <div className={s.statDivider} />
        <div className={s.statItem}>
          <span className={s.statVal} style={{ color:'#2DBD97', fontSize:16 }}>{fmt(totalValue)}</span>
          <span className={s.statLbl}>Total value</span>
        </div>
      </div>

      {/* Bulk bar */}
      {selected.length > 0 && (
        <div className={s.bulkBar}>
          <span className={s.bulkCount}>{selected.length} selected</span>
          <button className={s.bulkDelete} onClick={deleteSelected}>
            <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" size={13} />
            Delete
          </button>
          <button className={s.bulkClear} onClick={() => setSelected([])}>Deselect all</button>
        </div>
      )}

      {/* Toolbar */}
      <div className={s.toolbar}>
        <div className={s.filterTabs}>
          {['All','Open','Completed'].map(f => (
            <button key={f} className={`${s.ftab} ${filter===f?s.ftabOn:''}`}
              onClick={() => { setFilter(f); setPage(1) }}>
              {f}
              {f !== 'All' && (
                <span className={s.ftabCount}>{orders.filter(o=>o.status===f.toLowerCase()).length}</span>
              )}
            </button>
          ))}
          <button className={s.ftabAdd}><Ic d="M12 5v14M5 12h14" size={12} /></button>
        </div>
        <div className={s.toolbarRight}>
          <div className={s.searchBox}>
            <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} stroke="#9CA3AF" />
            <input className={s.searchInput} placeholder="Search and filter"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
            {search && <button className={s.searchClear} onClick={() => setSearch('')}>
              <Ic d="M18 6L6 18M6 6l12 12" size={12} stroke="#9CA3AF" />
            </button>}
          </div>
          <button className={s.iconBtn}><Ic d="M22 3H2l8 9.46V19l4 2v-8.54L22 3" size={13} /></button>
          <button className={s.iconBtn}><Ic d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" size={13} /></button>
        </div>
      </div>

      {/* Table */}
      <div className={s.tableWrap}>
        <div className={s.tHead}>
          <div className={s.tCheck}>
            <input type="checkbox" className={s.checkbox}
              checked={selected.length === paginated.length && paginated.length > 0}
              onChange={toggleAll} />
          </div>
          <span>Draft order</span>
          <span>PO number</span>
          <span className={s.sortHead} onClick={() => setSortDir(d => d==='asc'?'desc':'asc')}>
            Date <Ic d={sortDir==='asc'?'M18 15l-6-6-6 6':'M6 9l6 6 6-6'} size={11} />
          </span>
          <span>Customer</span>
          <span>Status</span>
          <span className={s.tRight}>Total</span>
        </div>

        {paginated.length === 0 ? (
          <div className={s.emptyState}>
            <Ic d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" size={40} stroke="#D1D5DB" />
            <p className={s.emptyTitle}>{search ? `No results for "${search}"` : 'No draft orders'}</p>
            <p className={s.emptySub}>Create a draft order to get started</p>
            {!search && <button className={s.btnPrimary} onClick={() => setShowModal(true)}>Create order</button>}
          </div>
        ) : paginated.map((o, i) => (
          <div key={o.id} className={s.tRow}
            style={{ animationDelay:`${i*18}ms` }}
            onClick={() => navigate(`/orders/drafts/${o.id}`)}>
            <div className={s.tCheck} onClick={e => e.stopPropagation()}>
              <input type="checkbox" className={s.checkbox}
                checked={selected.includes(o.id)} onChange={() => toggleSelect(o.id)} />
            </div>
            <span className={s.orderId}>#{o.id}</span>
            <span className={s.poNum}><span className={s.dash}>—</span></span>
            <span className={s.dateCell}>{o.date}</span>
            <span className={o.customer==='No customer'?s.noCustomer:s.customerCell}>{o.customer}</span>
            <span><StatusPill status={o.status} /></span>
            <span className={`${s.tRight} ${s.totalCell}`}>{o.total > 0 ? fmt(o.total) : <span className={s.dash}>₦0.00</span>}</span>
          </div>
        ))}

        {/* Pagination */}
        <div className={s.pagination}>
          <button className={s.pageBtn} disabled={page===1} onClick={() => setPage(p=>p-1)}>
            <Ic d="M15 18l-6-6 6-6" size={14} />
          </button>
          <span className={s.pageInfo}>
            {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <button className={s.pageBtn} disabled={page>=totalPages} onClick={() => setPage(p=>p+1)}>
            <Ic d="M9 18l6-6-6-6" size={14} />
          </button>
        </div>
      </div>

      {showModal && <CreateModal onClose={() => setShowModal(false)} onCreate={createOrder} />}
    </div>
  )
}
