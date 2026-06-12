import { useCallback, useState } from 'react'
import { customersApi } from '../../../api/customers'
import { toast } from '../../../lib/toast'
import { useAuth } from '../../../auth/useAuth'

const CSV_COLUMNS = [
  ['id',          'Customer ID'],
  ['name',        'Name'],
  ['email',       'Email'],
  ['phone',       'Phone'],
  ['city',        'City'],
  ['state',       'State'],
  ['tag',         'Segment'],
  ['status',      'Status'],
  ['totalOrders', 'Total Orders'],
  ['totalSpent',  'Total Spent (NGN)'],
  ['firstOrder',  'First Order'],
  ['lastOrder',   'Last Order'],
]

// Quote a CSV cell. Protects against commas/quotes/newlines and CSV injection
// (cells starting with =, +, -, @ get a leading single quote in Excel).
const csvCell = v => {
  if (v == null) return ''
  const s = String(v)
  const needsQuoting = /[",\n\r]|^[=+\-@]/.test(s)
  return needsQuoting ? `"${s.replace(/"/g, '""')}"` : s
}

const buildCsv = rows => {
  const header = CSV_COLUMNS.map(([, label]) => csvCell(label)).join(',')
  const body = rows.map(r => CSV_COLUMNS.map(([key]) => csvCell(r[key])).join(',')).join('\n')
  return `${header}\n${body}`
}

const downloadCsv = (csv, filename) => {
  // BOM so Excel reads UTF-8 (₦) correctly.
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Export hook. Asks the API for the matching rows (server-filtered, so the
 * export reflects what the user is viewing), then writes the CSV locally.
 *
 * When the real backend supports server-side export, it can return a
 * presigned URL instead of rows — adjust this hook to detect and follow it.
 */
export function useCustomerExport(filterParams) {
  const { hasPermission } = useAuth()
  const [isExporting, setIsExporting] = useState(false)

  const exportCsv = useCallback(async () => {
    if (!hasPermission('customers:export')) {
      toast.error("You don't have permission to export.")
      return
    }
    setIsExporting(true)
    const t = toast.loading('Preparing export…')
    try {
      const result = await customersApi.exportCsv(filterParams)
      if (result.url) {
        // Real backend served us a presigned URL — just trigger the download.
        window.location.href = result.url
      } else if (Array.isArray(result.rows)) {
        if (!result.rows.length) {
          toast.dismiss(t)
          toast.warning('No customers to export.')
          return
        }
        const csv = buildCsv(result.rows)
        downloadCsv(csv, `customers-${new Date().toISOString().split('T')[0]}.csv`)
      }
      toast.dismiss(t)
      toast.success('Export ready')
    } catch (err) {
      toast.dismiss(t)
      toast.error(err)
    } finally {
      setIsExporting(false)
    }
  }, [filterParams, hasPermission])

  return { exportCsv, isExporting }
}