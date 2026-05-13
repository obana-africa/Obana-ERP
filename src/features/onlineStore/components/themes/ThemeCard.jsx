import { useState } from 'react'

/**
 * ThemeCard - Reusable card for displaying a theme
 * 
 * @param {Object} theme - Theme data
 * @param {boolean} isActive - Whether this is the currently active theme
 * @param {Function} onEdit - Called when Edit button is clicked
 * @param {Function} onPublish - Called when Publish button is clicked  
 * @param {Function} onDelete - Called when Delete button is clicked
 * @param {Function} onDuplicate - Called when Duplicate button is clicked
 * @param {Function} onPreview - Called when Preview button is clicked
 */
const ThemeCard = ({ 
  theme, 
  isActive = false,
  onEdit, 
  onPublish, 
  onDelete,
  onDuplicate,
  onPreview 
}) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '16px 20px',
      background: '#fff',
      border: isActive ? '2px solid #2DBD97' : '1px solid #E5E7EB',
      borderRadius: isActive ? '12px' : '0',
      boxShadow: isActive ? '0 0 0 3px rgba(45,189,151,0.12)' : 'none',
      position: 'relative'
    }}>
      {/* Theme Thumbnail */}
      <div style={{
        width: 96,
        height: 64,
        borderRadius: 8,
        background: theme.primary || '#1b3b5f',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Simple theme preview */}
        <div style={{ width: '100%', height: '100%', padding: 4 }}>
          <div style={{ 
            height: 12, 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: 2,
            marginBottom: 4,
            display: 'flex',
            alignItems: 'center',
            padding: '0 4px',
            gap: 4
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.accent || '#2DBD97' }} />
          </div>
          <div style={{ 
            height: 'calc(100% - 16px)',
            display: 'flex',
            gap: 2
          }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }} />
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }} />
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }} />
          </div>
        </div>
      </div>

      {/* Theme Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {isActive && (
          <span style={{
            display: 'inline-block',
            fontSize: 10,
            fontWeight: 700,
            color: '#059669',
            background: '#ECFDF5',
            padding: '2px 8px',
            borderRadius: 99,
            marginBottom: 4
          }}>
            ● Live
          </span>
        )}
        <p style={{ 
          fontSize: 14, 
          fontWeight: 700, 
          color: '#111827', 
          margin: '0 0 3px' 
        }}>
          {theme.name || 'Untitled Theme'}
        </p>
        <p style={{ 
          fontSize: 12, 
          color: '#6B7280', 
          margin: '0 0 4px' 
        }}>
          Last saved: {theme.savedAt || 'Just now'}
        </p>
        {theme.version && (
          <p style={{ 
            fontSize: 11, 
            color: '#2DBD97', 
            fontWeight: 600, 
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2DBD97' }} />
            Version {theme.version}
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {/* Preview button */}
        {onPreview && (
          <button
            onClick={onPreview}
            style={{
              padding: '8px 14px',
              borderRadius: 7,
              border: '1.5px solid #E5E7EB',
              background: '#fff',
              color: '#374151',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            👁️ Preview
          </button>
        )}

        {/* Publish button */}
        {onPublish && !isActive && (
          <button
            onClick={onPublish}
            style={{
              padding: '7px 16px',
              borderRadius: 7,
              border: '1.5px solid #E5E7EB',
              background: '#fff',
              color: '#374151',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Publish
          </button>
        )}

        {/* Edit button */}
        {onEdit && (
          <button
            onClick={onEdit}
            style={{
              padding: '7px 16px',
              borderRadius: 7,
              border: 'none',
              background: '#111827',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {isActive ? 'Customize' : 'Edit'}
          </button>
        )}

        {/* More menu */}
        {(onDelete || onDuplicate) && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 7,
                border: '1.5px solid #E5E7EB',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#6B7280',
                fontSize: 16,
                fontWeight: 700
              }}
            >
              ⋯
            </button>

            {menuOpen && (
              <>
                <div 
                  style={{ position: 'fixed', inset: 0, zIndex: 49 }}
                  onClick={() => setMenuOpen(false)} 
                />
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 4,
                  background: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: 10,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  zIndex: 50,
                  minWidth: 160,
                  overflow: 'hidden'
                }}>
                  {onDuplicate && (
                    <button
                      onClick={() => { onDuplicate(); setMenuOpen(false) }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        width: '100%',
                        padding: '10px 14px',
                        border: 'none',
                        background: 'none',
                        fontSize: 13,
                        color: '#374151',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'inherit'
                      }}
                      onMouseEnter={e => e.target.style.background = '#F9FAFB'}
                      onMouseLeave={e => e.target.style.background = 'none'}
                    >
                      📋 Duplicate
                    </button>
                  )}
                  {onDelete && (
                    <>
                      {onDuplicate && <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '4px 0' }} />}
                      <button
                        onClick={() => { onDelete(); setMenuOpen(false) }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          width: '100%',
                          padding: '10px 14px',
                          border: 'none',
                          background: 'none',
                          fontSize: 13,
                          color: '#EF4444',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontFamily: 'inherit'
                        }}
                        onMouseEnter={e => e.target.style.background = '#FEF2F2'}
                        onMouseLeave={e => e.target.style.background = 'none'}
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ThemeCard