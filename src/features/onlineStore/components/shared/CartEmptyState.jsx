import { EmptyState } from '@/components/shared/EmptyState/EmptyState';
import { useNavigate } from 'react-router-dom';

export const CartEmptyState = ({ onContinueShopping }) => {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon="🛒"
      title="Your cart is empty"
      description="Looks like you haven't added any products to your cart yet. Browse our collection and find something you love."
      action={{
        label: 'Start Shopping',
        onClick: onContinueShopping || (() => navigate('/products'))
      }}
      secondaryAction={{
        label: 'View Collections',
        onClick: () => navigate('/collections')
      }}
      size="medium"
    />
  );
};