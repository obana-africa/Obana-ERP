import Icon from '@/components/ui/Icon/Icon';
import CollectionCard from './CollectionCard';
import s from '../Collections.module.css';

/**
 * Renders a list of collections as cards inside a CSS grid.
 *
 * @param {Object} props
 * @param {Array}  props.collections   – filtered/sorted collection objects
 * @param {Function} props.onEdit        – (collection) => void
 * @param {Function} props.onDelete      – (collectionId) => void
 * @param {Function} props.onManageInventory – (collection) => void
 * @param {Function} props.onViewProducts    – (collection) => void
 * @param {Function} props.onCreateNew   – () => void
 */
export default function CollectionGrid({
  collections,
  onEdit,
  onDelete,
  onManageInventory,
  onViewProducts,
  onCreateNew,
}) {
  return (
    <div className={s.collGrid}>
      {collections.map((c, i) => (
        <CollectionCard
          key={c.id}
          collection={c}
          style={{ animationDelay: `${i * 50}ms` }}
          onEdit={onEdit}
          onDelete={onDelete}
          onManageInventory={onManageInventory}
          onViewProducts={onViewProducts}
        />
      ))}
      <button className={s.addCollCard} onClick={onCreateNew}>
        <Icon name="plus" size={22} />
        <span>New Collection</span>
      </button>
    </div>
  );
}