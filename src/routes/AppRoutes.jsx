import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage  from '../pages/LandingPage/LandingPage'
import Login        from '../pages/Login/Login'
import Register     from '../pages/Register/Register'
import Dashboard    from '../pages/Dashboard/Dashboard'
// PRODUCT 
// import Products     from '../pages/Products/Products'
import ProductsPage from '../features/products/ProductsPage';
// import Collections from '../pages/Collections/Collections'
import CollectionsPage from '../features/Collections/CollectionsPage';
import Orders       from '../pages/Orders/Orders'
import Drafts            from '../pages/Orders/Drafts'
import AbandonedCheckouts from '../pages/Orders/AbandonedCheckouts'
import Customers    from '../pages/Customers/Customers'
import Segments from '../pages/Customers/Segments'
import Companies from '../pages/Customers/Companies'
import Inventory    from '../pages/Inventory/Inventory'
// import InventoryPage    from '../features/Inventory/InventoryPage'
import Transfers    from '../pages/Transfers/Transfers'
// import TransfersPage    from '../features/Transfers/TransfersPage'
import Content      from '../pages/Content/Content'
import Discounts    from '../pages/Discounts/Discounts'
//MARKETING
import Marketing      from '../pages/Marketing/Marketing'
import Campaigns      from '../pages/Marketing/Campaigns'
import CreateCampaign from '../pages/Marketing/CreateCampaign'
import Attribution    from '../pages/Marketing/Attribution'
import Analytics    from '../pages/Analytics/Analytics'
//MARKETS
import Markets    from '../pages/Markets/Markets'
import NewMarket  from '../pages/Markets/NewMarket'
import Catalogs   from '../pages/Markets/Catalogs'
import NewCatalog from '../pages/Markets/NewCatalog'
import Rollouts   from '../pages/Markets/Rollouts'
import NewRollout from '../pages/Markets/NewRollout'

import POS          from '../pages/POS/POS'
import Integrations from '../pages/Integrations/Integrations'
import Settings from '../pages/Settings/Settings'
// Online Store
import OnlineStoreThemes from '@/features/OnlineStore/pages/OnlineStoreThemes'
import OnlineStore       from '@/features/onlineStore/pages/OnlineStore'
import StorefrontPreview from '@/features/onlineStore/components/builder/StorefrontPreview'
//Admin
import AdminProfile from '../pages/AdminProfile/AdminProfile'

// Layout
import MainLayout   from '../components/layout/MainLayout/MainLayout'

const AppRoutes = () => (
  <Routes>

    {/* Public — no sidebar */}
    <Route path="/"         element={<LandingPage />} />
    <Route path="/landing"  element={<LandingPage />} />
    <Route path="/login"    element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/admin/profile" element={<AdminProfile />} />
    <Route path="/Settings" element={<Settings />} />

    {/* Dashboard — sidebar via MainLayout */}
    <Route element={<MainLayout />}>
      <Route path="/dashboard"            element={<Dashboard />} />
      <Route path="/products"             element={<ProductsPage />} />
      {/* <Route path="/products"             element={<Products />} /> */}
      <Route path="/collections" element={<CollectionsPage/>} />
      {/* <Route path='/collections' element={<Collections/>} /> */}
      <Route path="/orders"               element={<Orders />} />
      <Route path="/orders/drafts"      element={<Drafts />} />
      <Route path="/orders/drafts/:id"  element={<Drafts />} />
      <Route path="/orders/abandoned"   element={<AbandonedCheckouts />} />
      <Route path="/customers"            element={<Customers />} />
      <Route path="/customers/segments" element={<Segments />} />
      <Route path="/customers/segments/new" element={<Segments/>} />
      <Route path="/customers/companies" element={<Companies />} />
      {/* <Route path="/inventory"            element={<InventoryPage />} /> */}
      <Route path="/inventory"            element={<Inventory />} />
      <Route path="/transfers"            element={<Transfers />} />
      {/* <Route path="/transfers"            element={<TransfersPage />} /> */}
      <Route path="/content"              element={<Content />} />
      <Route path="/content/blog-posts"   element={<Content />} />
      <Route path="/content/menus"        element={<Content />} />
      <Route path="/content/files"        element={<Content />} />
      <Route path="/content/metaobjects"  element={<Content />} />
      <Route path="/discounts"            element={<Discounts />} />
      <Route path="/marketing"                   element={<Marketing />} />
      <Route path="/marketing/campaigns"         element={<Campaigns />} />
      <Route path="/marketing/campaigns/new"     element={<CreateCampaign />} />
      <Route path="/marketing/campaigns/:id"     element={<CreateCampaign />} />
      <Route path="/marketing/attribution"       element={<Attribution />} />
      <Route path="/analytics"            element={<Analytics />} />
      <Route path="/markets"                  element={<Markets />} />
      <Route path="/markets/new"              element={<NewMarket />} />
      <Route path="/markets/:id"              element={<NewMarket />} />
      <Route path="/markets/catalogs"         element={<Catalogs />} />
      <Route path="/markets/catalogs/new"     element={<NewCatalog />} />
      <Route path="/markets/catalogs/:id"     element={<NewCatalog />} />
      <Route path="/markets/rollouts"         element={<Rollouts />} />
      <Route path="/markets/rollouts/new"     element={<NewRollout />} />
      <Route path="/pos"                  element={<POS />} />
      <Route path="/Integrations" element={<Integrations />} />

        {/* Online Store Routes */}
      <Route path="/online-store"               element={<OnlineStoreThemes />} />
      <Route path="/online-store/themes"        element={<OnlineStoreThemes />} />
      <Route path="/online-store/editor"        element={<OnlineStore />} />
      <Route path="/online-store/editor/:themeId" element={<OnlineStore />} />
      <Route path="/online-store/preview"       element={<OnlineStore preview />} />

      {/* Catch-all unknown paths → dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

      
     
    </Route>
     {/* <Route path="/store/:storeId" element={<PublicStore />} /> */}

  </Routes>
)

export default AppRoutes
