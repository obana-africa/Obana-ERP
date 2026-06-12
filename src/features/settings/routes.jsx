import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

/**
 * Settings route configuration.
 *
 * Mounted by AppRoutes as nested children of /settings/* with SettingsLayout
 * as the layout boundary. Each panel is lazy-loaded so the bundle stays small.
 *
 * To add a panel:
 *   1. Drop a folder in panels/<Name>/ with <Name>Panel.jsx
 *   2. Add an entry to constants/nav.js (label + path)
 *   3. Add a lazy import + route below
 */

const GeneralPanel          = lazy(() => import('./panels/General/GeneralPanel'))
const PlanPanel             = lazy(() => import('./panels/Plan/PlanPanel'))
const BillingPanel          = lazy(() => import('./panels/Billing/BillingPanel'))
const UsersPanel            = lazy(() => import('./panels/Users/UsersPanel'))
const PaymentsPanel         = lazy(() => import('./panels/Payments/PaymentsPanel'))
const CheckoutPanel         = lazy(() => import('./panels/Checkout/CheckoutPanel'))
const CustomerAccountsPanel = lazy(() => import('./panels/CustomerAccounts/CustomerAccountsPanel'))
const ShippingPanel         = lazy(() => import('./panels/Shipping/ShippingPanel'))
const TaxesPanel            = lazy(() => import('./panels/Taxes/TaxesPanel'))
const LocationsPanel        = lazy(() => import('./panels/Locations/LocationsPanel'))
const SalesChannelsPanel    = lazy(() => import('./panels/SalesChannels/SalesChannelsPanel'))
const NotificationsPanel    = lazy(() => import('./panels/Notifications/NotificationsPanel'))
const SecurityPanel         = lazy(() => import('./panels/Security/SecurityPanel'))
const PoliciesPanel         = lazy(() => import('./panels/Policies/PoliciesPanel'))

export const SETTINGS_ROUTES = [
  // /settings → /settings/general
  { index: true, element: <Navigate to="general" replace /> },

  { path: 'general',            element: <GeneralPanel /> },
  { path: 'plan',               element: <PlanPanel /> },
  { path: 'billing',            element: <BillingPanel /> },
  { path: 'users',              element: <UsersPanel /> },
  { path: 'payments',           element: <PaymentsPanel /> },
  { path: 'checkout',           element: <CheckoutPanel /> },
  { path: 'customer-accounts',  element: <CustomerAccountsPanel /> },
  { path: 'shipping',           element: <ShippingPanel /> },
  { path: 'taxes',              element: <TaxesPanel /> },
  { path: 'locations',          element: <LocationsPanel /> },
  { path: 'locations/new',      element: <LocationsPanel /> },
  { path: 'locations/:id/edit', element: <LocationsPanel /> },
  { path: 'sales-channels',     element: <SalesChannelsPanel /> },
  { path: 'notifications',      element: <NotificationsPanel /> },
  { path: 'security',           element: <SecurityPanel /> },
  { path: 'policies',           element: <PoliciesPanel /> },
]