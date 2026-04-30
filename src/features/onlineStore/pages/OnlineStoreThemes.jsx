import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TEMPLATES } from '../utils/themeDefaults';
import ThemeCard from '../components/themes/ThemeCard';
import s from '../styles/themes.module.css';

export default function OnlineStoreThemes() {
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Load from API or localStorage
    return JSON.parse(localStorage.getItem('activeTheme')) || null;
  });
  
  const [draftThemes, setDraftThemes] = useState(() => {
    return JSON.parse(localStorage.getItem('draftThemes')) || [];
  });

  const handlePublish = (draft) => {
    const newCurrent = { ...draft, isLive: true, publishedAt: new Date().toISOString() };
    setCurrentTheme(newCurrent);
    setDraftThemes(prev => prev.filter(t => t.id !== draft.id));
    localStorage.setItem('activeTheme', JSON.stringify(newCurrent));
    localStorage.setItem('draftThemes', JSON.stringify(draftThemes));
  };

  const handleAddTemplate = (template) => {
    const draft = {
      id: `${template.id}-${Date.now()}`,
      name: template.name,
      theme: template.theme,
      createdAt: new Date().toISOString(),
      version: '1.0.0'
    };
    setDraftThemes(prev => [...prev, draft]);
    localStorage.setItem('draftThemes', JSON.stringify([...draftThemes, draft]));
  };

  return (
    <div className={s.page}>
      <header className={s.header}>
        <h1 className={s.title}>Themes</h1>
        <button className={s.editBtn} onClick={() => navigate('/online-store')}>
          Customize
        </button>
      </header>

      {currentTheme && (
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Current Theme</h2>
          <ThemeCard
            theme={currentTheme}
            isActive
            onEdit={() => navigate('/online-store')}
          />
        </section>
      )}

      {draftThemes.length > 0 && (
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Draft Themes</h2>
          <div className={s.themeList}>
            {draftThemes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                onPublish={() => handlePublish(theme)}
                onEdit={() => navigate('/online-store')}
                onDelete={() => {
                  setDraftThemes(prev => prev.filter(t => t.id !== theme.id));
                }}
              />
            ))}
          </div>
        </section>
      )}

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Template Library</h2>
        <div className={s.templateGrid}>
          {TEMPLATES.map((template) => (
            <div key={template.id} className={s.templateCard}>
              <img src={template.thumbnail} alt={template.name} className={s.templateImage} />
              <div className={s.templateInfo}>
                <h3 className={s.templateName}>{template.name}</h3>
                <p className={s.templateCategory}>{template.category}</p>
                <button
                  className={s.addBtn}
                  onClick={() => handleAddTemplate(template)}
                >
                  Add to Library
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}