import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import s from './Markets.module.css'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const SAMPLE_PRODUCTS = [
  { id:1, name:'! Solid Crew Knitwear',            variant:'Navy / L',   price:28000, draft:false },
  { id:2, name:'! Solid Dave Barro Pant',           variant:'Grey',       price:38000, draft:false },
  { id:3, name:'! Solid Mens Knit Sweatshirt In Khaki', variant:'Khaki',  price:25000, draft:true  },
  { id:4, name:'! Solid Ryder Regular Waist Fit Jean',  variant:'2 variants', price:35000, draft:true },
  { id:5, name:'! Solid Sd-Hamdani Wool Knitwear',  variant:'Brown / L',  price:25000, draft:false },
  { id:6, name:'! Solid SDDave Barro Pant',         variant:'Grey / 33',  price:30000, draft:false },
  { id:7, name:'! Solid SDDunley Ryder Jean',       variant:'Blue / 29',  price:38000, draft:false },
  { id:8, name:'! Solid SDErico Filip Pant',        variant:'Brown',      price:30000, draft:false },
]

export default function NewCatalog() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isEdit   = Boolean(id)

  const [title,      setTitle]      = useState('')
  const [status,     setStatus]     = useState('active')
  const [adjDir,     setAdjDir]     = useState('Decrease')
  const [adjPct,     setAdjPct]     = useState('0')
  const [inclComp,   setInclComp]   = useState(false)
  const [autoIncl,   setAutoIncl]   = useState(true)
  const [prodFilter, setProdFilter] = useState('Included')
  const [isDirty,    setIsDirty]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [prices,     setPrices]     = useState({})

  const setPrice = (id, val) => setPrices(p => ({ ...p, [id]: val }))
  const set = (k, v) => { setIsDirty(true) }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    setSaving(false); setIsDirty(false)
    navigate('/markets/catalogs')
  }

  const handleDiscard = () => {
    if (isDirty && !window.confirm('Discard changes?')) return
    navigate('/markets/catalogs')
  }

  return (
    <div className={s.formPage}>
      {isDirty && (
        <div className={s.unsavedBar}>
          <span className={s.unsavedDot} />
          <span>Unsaved changes</span>
          <div className={s.unsavedRight}>
            <button className={s.discardBtn} onClick={handleDiscard}>Discard</button>
            <button className={s.saveTopBtn} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}

      <div className={s.formHeader}>
        <div className={s.formHeaderLeft}>
          <button className={s.breadBack} onClick={() => navigate('/markets/catalogs')}>
            <Ic d="M19 12H5M12 5l-7 7 7 7" size={14} />
          </button>
          <span className={s.breadSep}>›</span>
          <h1 className={s.formTitle}>{isEdit ? 'Edit catalog' : 'New catalog'}</h1>
        </div>
      </div>

      <div style={{ padding: '24px 28px', maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Title + status + markets */}
        <div className={s.card}>
          <div className={s.cardPad}>
            <div className={s.nameStatusRow} style={{ marginBottom: 16 }}>
              <div className={s.inputCount} style={{ flex: 1, position: 'relative' }}>
                <input className={s.input}
                  placeholder="Title"
                  value={title} onChange={e => { setTitle(e.target.value); setIsDirty(true) }}
                  maxLength={255}
                  style={{ paddingRight: 70 }} />
                <span className={s.counter}>{title.length}/255</span>
              </div>
              <select className={s.statusSel} value={status} onChange={e => setStatus(e.target.value)}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Markets row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: '#374151' }}>Markets</span>
              <button className={s.addCondBtn}>
                <Ic d="M12 5v14M5 12h14" size={13} />
                Add a market
              </button>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className={s.card}>
          <div className={s.cardPad}>
            <div className={s.cardTitle}>Pricing</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13.5, color: '#374151' }}>Set prices in</span>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1.5px solid var(--border)', borderRadius: 8, background: '#fff', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer' }}>
                Store currency (NGN ₦) <Ic d="M6 9l6 6 6-6" size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13.5, color: '#374151', minWidth: 120 }}>Price adjustment</span>
              <button style={{ padding: '7px 12px', border: '1.5px solid var(--border)', borderRadius: 8, background: '#fff', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer', minWidth: 36 }}>
                −
              </button>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                <input type="number" style={{ width: 60, padding: '7px 10px', border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: 13, background: '#fff' }}
                  value={adjPct} onChange={e => setAdjPct(e.target.value)} />
                <span style={{ padding: '7px 10px', background: 'var(--blt)', borderLeft: '1.5px solid var(--border)', fontSize: 13, color: '#6B7280' }}>%</span>
              </div>
              <select className={s.select} style={{ width: 120 }} value={adjDir} onChange={e => setAdjDir(e.target.value)}>
                <option>Decrease</option>
                <option>Increase</option>
              </select>
              <label className={s.toggleRow}>
                <label className={s.toggle}>
                  <input type="checkbox" checked={inclComp} onChange={e => setInclComp(e.target.checked)} />
                  <span className={s.toggleSlider} />
                </label>
                Include compare-at price
              </label>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className={s.card}>
          <div className={s.productsSectionHead}>
            <span className={s.productsSectionTitle}>Products</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className={s.btnOutline} style={{ fontSize: 12.5, padding: '6px 14px' }}>Export</button>
              <button className={s.btnOutline} style={{ fontSize: 12.5, padding: '6px 14px' }}>Import</button>
            </div>
          </div>

          <div className={s.autoIncludeRow}>
            <label className={s.toggle} style={{ marginRight: 6 }}>
              <input type="checkbox" checked={autoIncl} onChange={e => setAutoIncl(e.target.checked)} />
              <span className={s.toggleSlider} />
            </label>
            Automatically include new products
          </div>

          <div className={s.prodFilterTabs}>
            {['Included', 'Excluded', 'All'].map(f => (
              <button key={f}
                className={`${s.prodFilterTab} ${prodFilter === f ? s.prodFilterTabOn : ''}`}
                onClick={() => setProdFilter(f)}>
                {f}
              </button>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <button className={s.iconBtn} style={{ width: 28, height: 28, borderRadius: 7 }}>
                <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={13} />
              </button>
              <button className={s.iconBtn} style={{ width: 28, height: 28, borderRadius: 7 }}>
                <Ic d="M22 3H2l8 9.46V19l4 2v-8.54L22 3" size={13} />
              </button>
              <button className={s.iconBtn} style={{ width: 28, height: 28, borderRadius: 7 }}>
                <Ic d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" size={13} />
              </button>
            </div>
          </div>

          <div className={s.prodTHead}>
            <span><input type="checkbox" className={s.checkbox} /></span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              Product <Ic d="M18 15l-6-6-6 6" size={11} />
            </span>
            <span>Price in NGN</span>
            <span>Compare at price</span>
            <span>Rules</span>
          </div>

          {SAMPLE_PRODUCTS.map((prod, i) => (
            <div key={prod.id} className={s.prodRow} style={{ animationDelay: `${i * 25}ms` }}>
              <span><input type="checkbox" className={s.checkbox} /></span>
              <span>
                <div className={s.prodName}>
                  {prod.name}
                  {prod.draft && <span className={s.draftPill}>Draft</span>}
                </div>
                <div className={s.prodVariant}>{prod.variant}</div>
              </span>
              <span>
                <div className={s.priceInput}>
                  <span className={s.pricePrefix}>₦</span>
                  <input type="number" className={s.priceInputField}
                    value={prices[prod.id] ?? prod.price}
                    onChange={e => setPrice(prod.id, e.target.value)} />
                </div>
              </span>
              <span>
                <div className={s.priceInput}>
                  <span className={s.pricePrefix}>₦</span>
                  <input type="number" className={s.priceInputField}
                    placeholder="" />
                </div>
              </span>
              <span />
            </div>
          ))}

          {/* Pagination stub */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
            <button className={s.iconBtn} style={{ width: 28, height: 28, borderRadius: 7 }}>‹</button>
            <button className={s.iconBtn} style={{ width: 28, height: 28, borderRadius: 7 }}>›</button>
          </div>
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #E5E7EB', padding: '12px 28px', display: 'flex', justifyContent: 'flex-end', gap: 10, zIndex: 40 }}>
        <button className={s.btnGhost} onClick={handleDiscard}>Cancel</button>
        <button className={s.btnPrimary} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}
