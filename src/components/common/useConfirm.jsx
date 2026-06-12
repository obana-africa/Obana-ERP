import { useCallback, useRef, useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

/**
 * Promise-style confirmation. Returns `[confirm, ConfirmElement]`. Render
 * the element once near the page root, then await `confirm(...)` anywhere:
 *
 *   const [confirm, ConfirmElement] = useConfirm()
 *
 *   const onDelete = async () => {
 *     const ok = await confirm({
 *       title: 'Delete customer?',
 *       message: 'This cannot be undone.',
 *       confirmLabel: 'Delete',
 *       variant: 'danger',
 *     })
 *     if (!ok) return
 *     deleteMutation.mutate(id)
 *   }
 *
 *   return <>{ConfirmElement} ... </>
 */
export function useConfirm() {
  const [state, setState] = useState({ open: false, props: {} })
  const resolverRef = useRef(null)

  const confirm = useCallback(props => {
    return new Promise(resolve => {
      resolverRef.current = resolve
      setState({ open: true, props })
    })
  }, [])

  const handle = (result) => () => {
    setState(s => ({ ...s, open: false }))
    resolverRef.current?.(result)
    resolverRef.current = null
  }

  const element = (
    <ConfirmDialog
      open={state.open}
      {...state.props}
      onConfirm={handle(true)}
      onCancel={handle(false)}
    />
  )

  return [confirm, element]
}