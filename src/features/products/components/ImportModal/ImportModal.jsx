import { useState, useRef } from 'react';
import Modal from '@/components/ui/Modal/Modal';
import Icon from '@/components/ui/Icon/Icon';
import { IMPORT_PLATFORMS } from '@/data/products';
import s from '../AddProductModal/AddProductModal.module.css'; // shares styles

export default function ImportModal({ isOpen, onClose }) {
  const [selected, setSelected] = useState(null);
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);

  const handleAction = () => {
    // In production, this would trigger the import service
    console.log('Import:', selected, file);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Products"
      footer={
        <>
          <button className={s.btnGhost} onClick={onClose}>
            Cancel
          </button>
          <button
            className={s.btnPrimary}
            disabled={!selected}
            onClick={handleAction}
          >
            {selected === 'CSV File' ? 'Upload & Import' : `Connect ${selected || '…'}`}
          </button>
        </>
      }
    >
      <p className={s.importHint}>Choose a platform to import your products from</p>
      <div className={s.platformGrid}>
        {IMPORT_PLATFORMS.map((p) => (
          <button
            key={p.name}
            className={`${s.platformCard} ${selected === p.name ? s.platformActive : ''}`}
            onClick={() => setSelected(p.name)}
          >
            <span className={s.platformEmoji}>{p.icon}</span>
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      {selected === 'CSV File' && (
        <div className={s.csvZone} onClick={() => fileRef.current.click()}>
          <Icon name="upload" size={24} stroke="#9CA3AF" />
          <p>{file ? file.name : 'Click to upload CSV file'}</p>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
      )}

      {selected && selected !== 'CSV File' && (
        <div className={s.importInfo}>
          <Icon name="bell" size={15} />
          You'll be redirected to connect your {selected} account and select products to import.
        </div>
      )}
    </Modal>
  );
}