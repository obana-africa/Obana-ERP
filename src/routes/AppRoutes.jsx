import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

// ── Eager (above-the-fold) ─────────────────────────────────
import LandingPage from '../pages/LandingPage/LandingPage'
import Login       from '../pages/Login/Login'
import Register    from '../pages/Register/Register'
import Dashboard   from '../pages/Dashboard/Dashboard'

// ── Layouts ────────────────────────────────────────────────
import MainLayout     from '../components/layout/MainLayout/MainLayout'
// import SettingsLayout from '../feature/Settings/SettingsLayout'
// import { SETTINGS_ROUTES } from '../pages/Settings/routes'
import ProfileLayout  from '../components/layout/ProfileLayout/ProfileLayout'

// ── Auth & fallback ────────────────────────────────────────
import RequireAuth   from '../auth/RequireAuth'
import RouteFallback from '../components/common/RouteFallback'

// ── Lazy (Main app) ────────────────────────────────────────
const ProductsPage    = lazy(() => import('../features/products/ProductsPage'))
// const CollectionsPage = lazy(() => import('../features/Collections/CollectionsPage'))
const Inventory       = lazy(() => import('../pages/Inventory/Inventory'))
// const TransfersPage   = lazy(() => import('../features/Transfers/TransfersPage'))

const Orders             = lazy(() => import('../pages/Orders/Orders'))
const Drafts             = lazy(() => import('../pages/Orders/Drafts'))
const AbandonedCheckouts = lazy(() => import('../pages/Orders/AbandonedCheckouts'))

const Customers = lazy(() => import('../pages/Customers/Customers'))
const Segments  = lazy(() => import('../pages/Customers/Segments'))
const Companies = lazy(() => import('../pages/Customers/Companies'))

const Content = lazy(() => import('../pages/Content/Content'))

const Marketing      = lazy(() => import('../pages/Marketing/Marketing'))
const Campaigns      = lazy(() => import('../pages/Marketing/Campaigns'))
const CreateCampaign = lazy(() => import('../pages/Marketing/CreateCampaign'))
const Attribution    = lazy(() => import('../pages/Marketing/Attribution'))

const Markets    = lazy(() => import('../pages/Markets/Markets'))
const NewMarket  = lazy(() => import('../pages/Markets/NewMarket'))
const Catalogs   = lazy(() => import('../pages/Markets/Catalogs'))
const NewCatalog = lazy(() => import('../pages/Markets/NewCatalog'))
const Rollouts   = lazy(() => import('../pages/Markets/Rollouts'))
const NewRollout = lazy(() => import('../pages/Markets/NewRollout'))

const OnlineStoreThemes      = lazy(() => import('../pages/OnlineStore/OnlineStoreThemes'))
const WebshopBuilder         = lazy(() => import('../pages/OnlineStore/webshopBuilder/WebshopBuilder'))
const OnlineStorePages       = lazy(() => import('../pages/OnlineStore/components/OnlineStorePages'))
const OnlineStorePageEditor  = lazy(() => import('../pages/OnlineStore/components/OnlineStorePageEditor'))
const OnlineStorePreferences = lazy(() => import('../pages/OnlineStore/components/OnlineStorePreferences'))

const Discounts    = lazy(() => import('../pages/Discounts/Discounts'))
const Analytics    = lazy(() => import('../pages/Analytics/Analytics'))
const POS          = lazy(() => import('../pages/POS/POS'))
const Integrations = lazy(() => import('../pages/Integrations/Integrations'))

// ── Lazy (Settings — own sidebar) ──────────────────────────
const Settings = lazy(() => import('../pages/Settings/Settings'))

// ── Lazy (Admin Profile — own sidebar) ─────────────────────
const AdminProfile = lazy(() => import('../pages/AdminProfile/AdminProfile'))

// ── 404 ────────────────────────────────────────────────────
const NotFound = lazy(() => import('../pages/NotFound/NotFound'))

const AppRoutes = () => (
  <Suspense fallback={<RouteFallback />}>
    <Routes>
      {/* ════════════════════════════════════════════════════
          PUBLIC — no layout
          ════════════════════════════════════════════════════ */}
      <Route path="/"         element={<LandingPage />} />
      <Route path="/landing"  element={<LandingPage />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ════════════════════════════════════════════════════
          MAIN APP — MainLayout (primary sidebar)
          ════════════════════════════════════════════════════ */}
      <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Products */}
        <Route path="/products"    element={<ProductsPage />} />
        {/* <Route path="/collections" element={<CollectionsPage />} /> */}
        <Route path="/inventory"   element={<Inventory />} />
        {/* <Route path="/transfers"   element={<TransfersPage />} /> */}

        {/* Orders */}
        <Route path="/orders"             element={<Orders />} />
        <Route path="/orders/drafts"      element={<Drafts />} />
        <Route path="/orders/drafts/:id"  element={<Drafts />} />
        <Route path="/orders/abandoned"   element={<AbandonedCheckouts />} />

        {/* Customers — specific paths BEFORE :param paths */}
        <Route path="/customers"                   element={<Customers />} />
        <Route path="/customers/companies"         element={<Companies />} />
        <Route path="/customers/segments"          element={<Segments />} />
        <Route path="/customers/segments/new"      element={<Segments />} />
        <Route path="/customers/segments/:segment" element={<Customers />} />

        {/* Content */}
        <Route path="/content"              element={<Content />} />
        <Route path="/content/blog-posts"   element={<Content />} />
        <Route path="/content/menus"        element={<Content />} />
        <Route path="/content/files"        element={<Content />} />
        <Route path="/content/metaobjects"  element={<Content />} />

        {/* Marketing */}
        <Route path="/marketing"               element={<Marketing />} />
        <Route path="/marketing/campaigns"     element={<Campaigns />} />
        <Route path="/marketing/campaigns/new" element={<CreateCampaign />} />
        <Route path="/marketing/campaigns/:id" element={<CreateCampaign />} />
        <Route path="/marketing/attribution"   element={<Attribution />} />

        {/* Markets */}
        <Route path="/markets"                element={<Markets />} />
        <Route path="/markets/new"            element={<NewMarket />} />
        <Route path="/markets/:id"            element={<NewMarket />} />
        <Route path="/markets/catalogs"       element={<Catalogs />} />
        <Route path="/markets/catalogs/new"   element={<NewCatalog />} />
        <Route path="/markets/catalogs/:id"   element={<NewCatalog />} />
        <Route path="/markets/rollouts"       element={<Rollouts />} />
        <Route path="/markets/rollouts/new"   element={<NewRollout />} />

        {/* Online Store */}
        <Route path="/online-store"                  element={<OnlineStoreThemes />} />
        <Route path="/online-store/themes"           element={<OnlineStoreThemes />} />
        <Route path="/online-store/editor"           element={<WebshopBuilder />} />
        <Route path="/online-store/editor/:themeId"  element={<WebshopBuilder />} />
        <Route path="/online-store/pages"            element={<OnlineStorePages />} />
        <Route path="/online-store/pages/new"        element={<OnlineStorePageEditor />} />
        <Route path="/online-store/pages/:id"        element={<OnlineStorePageEditor />} />
        <Route path="/online-store/preferences"      element={<OnlineStorePreferences />} />

        {/* Other */}
        <Route path="/discounts"    element={<Discounts />} />
        <Route path="/analytics"    element={<Analytics />} />
        <Route path="/pos"          element={<POS />} />
        <Route path="/integrations" element={<Integrations />} />
      </Route>

      {/* ════════════════════════════════════════════════════
          SETTINGS — SettingsLayout (own sidebar)
          ════════════════════════════════════════════════════ */}
      {/* <Route element={<RequireAuth><SettingsLayout /></RequireAuth>}>
       <Route path="/settings" element={<SettingsLayout />}>
        {SETTINGS_ROUTES.map((r, i) => (
        <Route
          key={r.path || `index-${i}`}
          index={r.index}
          path={r.path}
          element={r.element}
        />
          ))}
        </Route>
        Future settings sub-pages live here:
            <Route path="/settings/team"     element={<TeamSettings />} />
            <Route path="/settings/billing"  element={<BillingSettings />} />
            <Route path="/settings/security" element={<SecuritySettings />} />
       
      </Route> */}

      {/* ════════════════════════════════════════════════════
          ADMIN PROFILE — ProfileLayout (own sidebar)
          ════════════════════════════════════════════════════ */}
      <Route element={<RequireAuth><ProfileLayout /></RequireAuth>}>
        <Route path="/admin/profile" element={<AdminProfile />} />
        {/* Future profile sub-pages live here:
            <Route path="/admin/profile/preferences" element={<Preferences />} />
            <Route path="/admin/profile/sessions"    element={<Sessions />} />
        */}
      </Route>

      {/* ════════════════════════════════════════════════════
          404
          ════════════════════════════════════════════════════ */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
)

export default AppRoutes