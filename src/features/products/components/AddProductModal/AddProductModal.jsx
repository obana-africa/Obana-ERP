import Modal from '@/components/ui/Modal/Modal';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import Input from '@/components/ui/Form/Input';
import Select from '@/components/ui/Form/Select';
import Textarea from '@/components/ui/Form/Textarea';
import Toggle from '@/components/ui/Form/Toggle';
import Dropzone from '@/components/ui/Form/Dropzone';
import { useProductForm } from './useProductForm';
import { useCollections } from '../../hooks/useCollections';
import { fmt } from '@/utils/formatters';
import s from './AddProductModal.module.css';

export default function AddProductModal({ isOpen, onClose, onAdd }) {
  const { collections } = useCollections();
  const {
    step,
    totalSteps,
    isFirstStep,
    isLastStep,
    productType,
    images,
    variants,
    formData,
    errors,
    profit,
    steps,
    setProductType,
    setField,
    goNext,
    goBack,
    addVariant,
    updateVariant,
    removeVariant,
    addImages,
    removeImage,
    submit,
  } = useProductForm({
    onSubmit: onAdd,
  });

  const handleSubmit = () => {
    submit();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Product"
      wide
      footer={
        <>
          <div className={s.footerLeft}>
            {!isFirstStep && (
              <Button variant="ghost" onClick={goBack}>
                <Icon name="chevronRight" size={14} style={{ transform: 'rotate(180deg)' }} />
                Back
              </Button>
            )}
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
          <div className={s.footerRight}>
            {!isLastStep ? (
              <Button variant="primary" onClick={goNext}>
                Next
                <Icon name="chevronRight" size={14} stroke="#fff" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!formData.name || !formData.stock}
              >
                Add Product
              </Button>
            )}
          </div>
        </>
      }
    >
      {/* Step progress indicator */}
      <div className={s.stepBar}>
        {steps.map((label, i) => (
          <div
            key={i}
            className={`${s.stepItem} ${step === i + 1 ? s.stepActive : ''} ${step > i + 1 ? s.stepDone : ''}`}
          >
            <div className={s.stepCircle}>{step > i + 1 ? '✓' : i + 1}</div>
            <span className={s.stepLabel}>{label}</span>
            {i < steps.length - 1 && <div className={s.stepLine} />}
          </div>
        ))}
      </div>

      {/* Step 1: Product Type */}
      {step === 1 && (
        <div className={s.stepContent}>
          <p className={s.stepHint}>
            Is this a regular product or does it have variations like colours, sizes?
          </p>
          <div className={s.typeGrid}>
            <button
              className={`${s.typeCard} ${productType === 'regular' ? s.typeCardActive : ''}`}
              onClick={() => setProductType('regular')}
            >
              <div className={s.typeIcon}>
                <Icon name="box" size={28} />
              </div>
              <strong>Regular Product</strong>
              <span>This is a product without variations</span>
            </button>
            <button
              className={`${s.typeCard} ${productType === 'variants' ? s.typeCardActive : ''}`}
              onClick={() => setProductType('variants')}
            >
              <div className={s.typeIcon}>
                <Icon name="package" size={28} />
              </div>
              <strong>Product with Variations</strong>
              <span>Different colours, sizes, etc.</span>
            </button>
          </div>

          {productType === 'variants' && (
            <div className={s.variantsSection}>
              <h4 className={s.sectionLabel}>Configure Variants</h4>
              {variants.map((v, i) => (
                <div key={i} className={s.variantRow}>
                  <Input
                    placeholder="Option name (e.g. Size)"
                    value={v.option}
                    onChange={e => updateVariant(i, 'option', e.target.value)}
                  />
                  <Input
                    placeholder="Values comma-separated (e.g. S, M, L, XL)"
                    value={v.values}
                    onChange={e => updateVariant(i, 'values', e.target.value)}
                  />
                  <button
                    className={s.btnIconDanger}
                    onClick={() => removeVariant(i)}
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addVariant}>
                + Add Variant Option
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Details & Images */}
      {step === 2 && (
        <div className={s.stepContent}>
          <Input
            label="Product Name"
            required
            placeholder="Enter product name"
            value={formData.name}
            onChange={e => setField('name', e.target.value)}
            error={errors.name}
          />

          <Dropzone
            label="Product Images"
            hint="Recommended: 930×1163px · Max 5MB"
            images={images}
            onAdd={addImages}
            onRemove={removeImage}
          />

          <Input
            label="Short Description"
            placeholder="Brief product summary"
            value={formData.shortDesc}
            onChange={e => setField('shortDesc', e.target.value)}
          />

          <div className={s.field}>
            <label className={s.label}>Long Description</label>
            <div className={s.richBar}>
              {['B', 'I', 'U', 'S', '❝', '≡', '⋮≡', '⋮⋮'].map(b => (
                <button key={b} className={s.richBtn} type="button">
                  {b}
                </button>
              ))}
            </div>
            <Textarea
              placeholder="Detailed product description…"
              value={formData.longDesc}
              onChange={e => setField('longDesc', e.target.value)}
            />
          </div>

          <Select
            label="Collection"
            value={formData.collection}
            onChange={e => setField('collection', e.target.value)}
            options={[
              { value: '', label: 'Select collection' },
              ...collections.map(c => ({ value: c.name, label: c.name })),
              { value: '__new', label: '+ Create New Collection' },
            ]}
          />
        </div>
      )}

      {/* Step 3: Pricing */}
      {step === 3 && (
        <div className={s.stepContent}>
          <Input
            label="Retail Price"
            required
            prefix="₦"
            type="number"
            placeholder="0.00"
            value={formData.price}
            onChange={e => setField('price', e.target.value)}
            error={errors.price}
          />

          <div className={s.fieldRow2}>
            <Input
              label="Cost Price"
              prefix="₦"
              type="number"
              placeholder="0.00"
              value={formData.costPrice}
              onChange={e => setField('costPrice', e.target.value)}
            />
            <Input
              label="Discounted Price"
              prefix="₦"
              type="number"
              placeholder="0.00"
              value={formData.discountPrice}
              onChange={e => setField('discountPrice', e.target.value)}
            />
          </div>

          {profit && (
            <div className={s.profitBadge}>
              Estimated profit per unit: <strong>{fmt(profit)}</strong>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Inventory */}
      {step === 4 && (
        <div className={s.stepContent}>
          <h4 className={s.sectionLabel}>Product Inventory</h4>

          <div className={s.fieldRow2}>
            <Input
              label="Stock Quantity"
              required
              type="number"
              placeholder="0"
              value={formData.stock}
              onChange={e => setField('stock', e.target.value)}
              error={errors.stock}
            />
            <Input
              label="Unit"
              placeholder="pc"
              value={formData.unit}
              onChange={e => setField('unit', e.target.value)}
            />
          </div>

          <Input
            label="Barcode"
            placeholder="Focus here to scan barcode"
            hint="Focus here and scan with barcode scanner"
            value={formData.barcode}
            onChange={e => setField('barcode', e.target.value)}
          />

          <Toggle
            label="Track order quantity"
            description="Enable quantity tracking for this product"
            checked={formData.trackQty}
            onChange={e => setField('trackQty', e.target.checked)}
          />
        </div>
      )}
    </Modal>
  );
}