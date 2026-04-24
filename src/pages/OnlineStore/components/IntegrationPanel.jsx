/**
 * IntegrationPanel.jsx
 * Connect external stores and payment gateways.
 * Supports: Shopify, WooCommerce, Custom REST API, Paystack, Flutterwave
 */

import { useState } from 'react'
import styles from '../OnlineStore.module.css'

const PLATFORMS = [
  {
    id: 'shopify',
    name: 'Shopify',
    logo: '🛒',
    desc: 'Pull products, orders & customers from your Shopify store',
    fields: [
      { key: 'storeUrl',  label: 'Store URL',   placeholder: 'your-store.myshopify.com', type: 'text' },
      { key: 'apiKey',    label: 'Access Token', placeholder: 'shpat_xxxxxxxxxxxxxxxx',   type: 'password' },
    ],
    docsUrl: 'https://shopify.dev/docs/api/admin-rest',
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    logo: '🏪',
    desc: 'Sync products from your WordPress / WooCommerce site',
    fields: [
      { key: 'storeUrl',        label: 'Site URL',        placeholder: 'https://yoursite.com',  type: 'text' },
      { key: 'apiKey',          label: 'Consumer Key',    placeholder: 'ck_xxxxxxxxxxxxxx',      type: 'text' },
      { key: 'apiSecret',       label: 'Consumer Secret', placeholder: 'cs_xxxxxxxxxxxxxx',      type: 'password' },
    ],
    docsUrl: 'https://woocommerce.github.io/woocommerce-rest-api-docs/',
  },
  {
    id: 'custom',
    name: 'Custom API',
    logo: '🔌',
    desc: 'Connect any REST API that returns a product list',
    fields: [
      { key: 'apiUrl',   label: 'Products Endpoint', placeholder: 'https://api.yourapp.com/products', type: 'text' },
      { key: 'apiKey',   label: 'API Key / Bearer Token (optional)', placeholder: 'sk_live_…', type: 'password' },
      { key: 'dataPath', label: 'JSON data path (optional)', placeholder: 'data.products', type: 'text' },
    ],
    docsUrl: null,
  },
]

const PAYMENT_GATEWAYS = [
  {
    id: 'paystack',
    name: 'Paystack',
    logo: '💳',
    desc: 'Accept card, bank transfer & USSD payments in Nigeria',
    fields: [
      { key: 'publicKey',  label: 'Public Key',  placeholder: 'pk_live_xxxxxxxx', type: 'text' },
      { key: 'secretKey',  label: 'Secret Key',  placeholder: 'sk_live_xxxxxxxx', type: 'password' },
    ],
  },
  {
    id: 'flutterwave',
    name: 'Flutterwave',
    logo: '🌊',
    desc: 'Pan-African payments — 9 countries, 150+ currencies',
    fields: [
      { key: 'publicKey',  label: 'Public Key',  placeholder: 'FLWPUBK-xxxxxxxx', type: 'text' },
      { key: 'secretKey',  label: 'Secret Key',  placeholder: 'FLWSECK-xxxxxxxx', type: 'password' },
    ],
  },
]

export default function IntegrationPanel({ integration, onConnect, onDisconnect }) {
  const [activePlatform, setActivePlatform] = useState(null)
  const [activeGateway,  setActiveGateway]  = useState(null)
  const [formData,   setFormData]   = useState({})
  const [testing,    setTesting]    = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [error,      setError]      = useState('')

  const setField = (k, v) => setFormData(f => ({ ...f, [k]: v }))

  const testConnection = async (platform) => {
    setTesting(true)
    setTestResult(null)
    setError('')

    try {
      let url, headers = {}

      if (platform.id === 'shopify') {
        url = `https://${formData.storeUrl}/admin/api/2024-01/products.json?limit=1`
        headers['X-Shopify-Access-Token'] = formData.apiKey
      } else if (platform.id === 'woocommerce') {
        const creds = btoa(`${formData.apiKey}:${formData.apiSecret}`)
        url = `${formData.storeUrl}/wp-json/wc/v3/products?per_page=1`
        headers['Authorization'] = `Basic ${creds}`
      } else {
        url = formData.apiUrl
        if (formData.apiKey) headers['Authorization'] = `Bearer ${formData.apiKey}`
      }

      const res = await fetch(url, { headers })
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const data = await res.json()
      setTestResult({ ok: true, count: Array.isArray(data) ? data.length : (data?.products?.length ?? 1) })
    } catch (err) {
      setError(err.message)
    } finally {
      setTesting(false)
    }
  }

  const connect = (platform) => {
    onConnect({
      platform: platform.id,
      platformName: platform.name,
      apiUrl: platform.id === 'shopify'
        ? `https://${formData.storeUrl}/admin/api/2024-01`
        : platform.id === 'woocommerce'
        ? `${formData.storeUrl}/wp-json/wc/v3`
        : formData.apiUrl,
      apiKey:    formData.apiKey,
      apiSecret: formData.apiSecret,
      dataPath:  formData.dataPath,
    })
    setActivePlatform(null)
    setFormData({})
    setTestResult(null)
  }

  return (
    <div className={styles.panelBody}>

      {/* ── Connected store ──────────────────────────────────── */}
      {integration && (
        <div className={styles.integConnected}>
          <div className={styles.integConnectedDot} />
          <div style={{ flex: 1 }}>
            <p className={styles.integConnectedName}>{integration.platformName}</p>
            <p className={styles.integConnectedUrl}>{integration.apiUrl}</p>
          </div>
          <button className={styles.integDisconnectBtn} onClick={onDisconnect}>
            Disconnect
          </button>
        </div>
      )}

      {/* ── Product source ───────────────────────────────────── */}
      <p className={styles.integGroupTitle}>Product Source</p>
      <p className={styles.panelHint}>Connect an external store to pull live products into your preview</p>

      {PLATFORMS.map(platform => (
        <div key={platform.id}>
          <button
            className={`${styles.integCard} ${activePlatform?.id === platform.id ? styles.integCardOpen : ''}`}
            onClick={() => {
              setActivePlatform(activePlatform?.id === platform.id ? null : platform)
              setFormData({})
              setTestResult(null)
              setError('')
            }}>
            <span className={styles.integLogo}>{platform.logo}</span>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <p className={styles.integName}>{platform.name}</p>
              <p className={styles.integDesc}>{platform.desc}</p>
            </div>
            {integration?.platform === platform.id && (
              <span className={styles.integActiveBadge}>Connected</span>
            )}
            <span className={styles.integChev}>›</span>
          </button>

          {activePlatform?.id === platform.id && (
            <div className={styles.integForm}>
              {platform.fields.map(f => (
                <div key={f.key} className={styles.edField}>
                  <label className={styles.edLabel}>{f.label}</label>
                  <input
                    className={styles.edInput}
                    type={f.type}
                    value={formData[f.key] || ''}
                    onChange={e => setField(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    autoComplete="off"
                  />
                </div>
              ))}

              {error && (
                <div className={styles.integError}>⚠️ {error}</div>
              )}
              {testResult?.ok && (
                <div className={styles.integSuccess}>
                  ✓ Connected — {testResult.count} product{testResult.count !== 1 ? 's' : ''} found
                </div>
              )}

              <div style={{ display: 'flex', gap: 7, marginTop: 6 }}>
                <button className={styles.integTestBtn}
                  onClick={() => testConnection(platform)} disabled={testing}>
                  {testing ? 'Testing…' : 'Test Connection'}
                </button>
                <button className={styles.integConnectBtn}
                  onClick={() => connect(platform)}
                  disabled={!testResult?.ok}>
                  Connect
                </button>
              </div>

              {platform.docsUrl && (
                <a href={platform.docsUrl} target="_blank" rel="noreferrer"
                  className={styles.integDocsLink}>
                  📖 View API docs ↗
                </a>
              )}
            </div>
          )}
        </div>
      ))}

      {/* ── Payment gateways ─────────────────────────────────── */}
      <p className={styles.integGroupTitle} style={{ marginTop: 20 }}>Payment Gateways</p>
      <p className={styles.panelHint}>Configure how customers pay at checkout</p>

      {PAYMENT_GATEWAYS.map(gw => (
        <div key={gw.id}>
          <button
            className={`${styles.integCard} ${activeGateway?.id === gw.id ? styles.integCardOpen : ''}`}
            onClick={() => {
              setActiveGateway(activeGateway?.id === gw.id ? null : gw)
              setFormData({})
            }}>
            <span className={styles.integLogo}>{gw.logo}</span>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <p className={styles.integName}>{gw.name}</p>
              <p className={styles.integDesc}>{gw.desc}</p>
            </div>
            <span className={styles.integChev}>›</span>
          </button>

          {activeGateway?.id === gw.id && (
            <div className={styles.integForm}>
              {gw.fields.map(f => (
                <div key={f.key} className={styles.edField}>
                  <label className={styles.edLabel}>{f.label}</label>
                  <input
                    className={styles.edInput}
                    type={f.type}
                    value={formData[f.key] || ''}
                    onChange={e => setField(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    autoComplete="off"
                  />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 7, marginTop: 6 }}>
                <button className={styles.integConnectBtn}
                  onClick={() => {
                    /* TODO: save gateway config to your API */
                    setActiveGateway(null)
                  }}>
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

    </div>
  )
}
