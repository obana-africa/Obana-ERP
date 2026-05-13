import { useRef } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import s from './Dropzone.module.css';

/**
 * Reusable dropzone for product images.
 *
 * @param {Object}       props
 * @param {string}       [props.label]     - Field label
 * @param {string}       [props.hint]      - Additional hint text
 * @param {Array}        props.images      - Current images: [{ url, name }]
 * @param {Function}     props.onAdd       - Called with FileList or File[]
 * @param {Function}     props.onRemove    - Called with index to remove
 * @param {string}       [props.accept]    - Allowed file types (default: image/*)
 * @param {boolean}      [props.multiple]  - Allow multiple files (default: true)
 */
export default function Dropzone({
  label,
  hint,
  images = [],
  onAdd,
  onRemove,
  accept = 'image/*',
  multiple = true,
}) {
  const fileRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onAdd(files);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) onAdd(files);
    e.target.value = ''; // allow re-upload of same file
  };

  return (
    <div className={s.field}>
      {label && (
        <label className={s.label}>
          {label}
          {hint && <span className={s.hint}>{hint}</span>}
        </label>
      )}

      <div
        className={s.dropzone}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        {images.length === 0 ? (
          <div className={s.placeholder}>
            <Icon name="upload" size={32} stroke="#9CA3AF" />
            <p>Drag & drop images or click to browse</p>
            {hint && <span>{hint}</span>}
          </div>
        ) : (
          <div className={s.imageGrid}>
            {images.map((img, i) => (
              <div key={i} className={s.imageThumb}>
                <img src={img.url} alt={img.name} />
                <button
                  className={s.removeBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(i);
                  }}
                  type="button"
                >
                  ×
                </button>
              </div>
            ))}
            <div className={s.addMore} onClick={() => fileRef.current?.click()}>
              <Icon name="plus" size={20} />
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        multiple={multiple}
        accept={accept}
        hidden
        onChange={handleFileChange}
      />
    </div>
  );
}