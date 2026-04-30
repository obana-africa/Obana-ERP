import { useState, useCallback, useEffect } from 'react';
import { useThemeHistory } from '../hooks/useThemeHistory';
import { useIntegrations } from '../hooks/useIntegrations';
import { storefrontApi } from '../services/storefrontApi';
import { DEFAULT_THEME, TEMPLATES, NAV_CONFIG } from '../utils/themeDefaults';
import StorefrontPreview from '../components/builder/StorefrontPreview';
import ThemeEditor from '../components/builder/ThemeEditor';
import IntegrationPanel from '../components/builder/IntegrationPanel';
import TemplateGallery from '../components/builder/TemplateGallery';
import s from '../styles/builder.module.css';

const PANELS = [
  { id: 'templates', label: 'Templates', shortcut: '1' },
  { id: 'theme', label: 'Theme', shortcut: '2' },
  { id: 'integrations', label: 'Integrations', shortcut: '3' },
  { id: 'settings', label: 'Settings', shortcut: '4' }
];

export default function OnlineStore() {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [activePanel, setActivePanel] = useState('templates');
  const [viewport, setViewport] = useState('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
  
  const { pushState, undo, redo, canUndo, canRedo } = useThemeHistory(theme);
  const { integration, connect, disconnect } = useIntegrations();

  const updateTheme = useCallback((key, value) => {
    setTheme(prev => {
      const next = { ...prev, [key]: value };
      pushState(next);
      return next;
    });
  }, [pushState]);

  const updateThemeBulk = useCallback((patch) => {
    setTheme(prev => {
      const next = { ...prev, ...patch };
      pushState(next);
      return next;
    });
  }, [pushState]);

  const applyTemplate = useCallback((template) => {
    const next = { ...theme, ...template.theme, activeTemplate: template.id };
    setTheme(next);
    pushState(next);
  }, [theme, pushState]);

  const saveTheme = useCallback(async () => {
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      await storefrontApi.saveTheme(theme);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  }, [theme]);

  const publish = useCallback(async () => {
    await saveTheme();
    await storefrontApi.publish();
    // Show success notification
  }, [saveTheme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      
      if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        const prevTheme = undo();
        if (prevTheme) setTheme(prevTheme);
      }
      
      if (mod && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        const nextTheme = redo();
        if (nextTheme) setTheme(nextTheme);
      }
      
      if (mod && e.key === 's') {
        e.preventDefault();
        saveTheme();
      }
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, saveTheme]);

  const isDirty = JSON.stringify(theme) !== JSON.stringify(DEFAULT_THEME);

  return (
    <div className={s.builder}>
      {/* Topbar */}
      <header className={s.topbar}>
        <div className={s.topbarLeft}>
          <h1 className={s.brandTitle}>Store Builder</h1>
          <span className={s.storeName}>{theme.storeName || 'Untitled Store'}</span>
        </div>
        
        <div className={s.viewportToggle}>
          {Object.entries(NAV_CONFIG).map(([key, config]) => (
            <button
              key={key}
              className={`${s.viewportBtn} ${viewport === key ? s.active : ''}`}
              onClick={() => setViewport(key)}
              title={config.label}
            >
              {config.icon}
            </button>
          ))}
        </div>
        
        <div className={s.topbarRight}>
          <button
            className={s.iconBtn}
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            ↩
          </button>
          <button
            className={s.iconBtn}
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            ↪
          </button>
          
          <button
            className={`${s.saveBtn} ${isDirty ? s.dirty : ''}`}
            onClick={saveTheme}
            disabled={isSaving}
          >
            {saveStatus === 'saving' ? 'Saving...' : 
             saveStatus === 'saved' ? '✓ Saved' : 
             saveStatus === 'error' ? '✗ Error' : 'Save'}
          </button>
          
          <button className={s.publishBtn} onClick={publish}>
            Publish
          </button>
        </div>
      </header>

      {/* Body */}
      <div className={s.body}>
        {/* Sidebar */}
        <aside className={s.sidebar}>
          <nav className={s.sidebarNav}>
            {PANELS.map((panel) => (
              <button
                key={panel.id}
                className={`${s.sidebarBtn} ${activePanel === panel.id ? s.active : ''}`}
                onClick={() => setActivePanel(panel.id)}
              >
                {panel.label}
              </button>
            ))}
          </nav>
          
          <div className={s.sidebarContent}>
            {activePanel === 'templates' && (
              <TemplateGallery
                templates={TEMPLATES}
                activeTemplate={theme.activeTemplate}
                onApply={applyTemplate}
              />
            )}
            {activePanel === 'theme' && (
              <ThemeEditor
                theme={theme}
                onUpdate={updateTheme}
                onUpdateBulk={updateThemeBulk}
              />
            )}
            {activePanel === 'integrations' && (
              <IntegrationPanel
                integration={integration}
                onConnect={connect}
                onDisconnect={disconnect}
              />
            )}
          </div>
        </aside>

        {/* Preview Canvas */}
        <main className={s.canvas}>
          <div className={`${s.previewFrame} ${s[viewport]}`}>
            <StorefrontPreview
              theme={theme}
              viewport={viewport}
              integration={integration}
            />
          </div>
        </main>
      </div>
    </div>
  );
}