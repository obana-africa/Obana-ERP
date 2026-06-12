import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBulkDeleteCustomers } from './useCustomerMutations'
import { useAuth } from '../../../auth/useAuth'
import { toast } from '../../../lib/toast'

export function useBulkSelection(visibleIds) {
  const [selected, setSelected] = useState([])

  const toggle = useCallback(
    id => setSelected(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id])),
    []
  )
  const toggleAll = useCallback(() => {
    setSelected(s =>
      s.length === visibleIds.length && visibleIds.length > 0 ? [] : visibleIds
    )
  }, [visibleIds])
  const clear = useCallback(() => setSelected([]), [])

  return { selected, toggle, toggleAll, clear }
}

/**
 * Bulk action handlers. Each:
 *   - Bails out if nothing selected
 *   - Checks the permission for the action
 *   - Either navigates to a workflow page or runs a mutation
 *
 * `confirmDelete` is provided by the caller (useConfirm) so the dialog
 * matches the page's design system instead of using window.confirm.
 */
export function useBulkActions({ selected, clear, confirmDelete }) {
  const navigate = useNavigate()
  const { hasPermission } = useAuth()
  const bulkDelete = useBulkDeleteCustomers()

  const ids = selected.join(',')
  const guard = (permission, action) => () => {
    if (!selected.length) return
    if (!hasPermission(permission)) {
      toast.error("You don't have permission to do that.")
      return
    }
    return action()
  }

  return {
    isDeleting: bulkDelete.isPending,

    emailSelected: guard('customers:bulk', () => navigate(`/customers/messaging/email?ids=${ids}`)),
    smsSelected:   guard('customers:bulk', () => navigate(`/customers/messaging/sms?ids=${ids}`)),
    tagSelected:   guard('customers:bulk', () => navigate(`/customers/bulk/tag?ids=${ids}`)),

    deleteSelected: guard('customers:delete', async () => {
      const ok = await confirmDelete({
        title: `Delete ${selected.length} customer${selected.length === 1 ? '' : 's'}?`,
        message: 'This action cannot be undone. Order history will be retained.',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        variant: 'danger',
      })
      if (!ok) return
      bulkDelete.mutate(selected, {
        onSettled: () => clear(),
      })
    }),
  }
}