import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage  from '../pages/LandingPage/LandingPage'
import Login        from '../pages/Login/Login'
import Register     from '../pages/Register/Register'
import Dashboard    from '../pages/Dashboard/Dashboard'
import Products     from '../pages/Products/Products'
import Orders       from '../pages/Orders/Orders'
import Customers    from '../pages/Customers/Customers'
import Inventory    from '../pages/Inventory/Inventory'
import Transfers    from '../pages/Transfers/Transfers'
import Content      from '../pages/Content/Content'
import Discounts    from '../pages/Discounts/Discounts'
import Analytics    from '../pages/Analytics/Analytics'
import OnlineStore  from '../pages/OnlineStore/OnlineStore'
import POS          from '../pages/POS/POS'
import MainLayout   from '../components/layout/MainLayout/MainLayout'

const AppRoutes = () => (
  <Routes>

    {/* Public — no sidebar */}
    <Route path="/"         element={<LandingPage />} />
    <Route path="/landing"  element={<LandingPage />} />
    <Route path="/login"    element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Dashboard — sidebar via MainLayout */}
    <Route element={<MainLayout />}>
      <Route path="/dashboard"            element={<Dashboard />} />
      <Route path="/products"             element={<Products />} />
      <Route path="/orders"               element={<Orders />} />
      <Route path="/customers"            element={<Customers />} />
      {/* <Route path='/collection' element={<Collections/>} /> */}
      <Route path="/inventory"            element={<Inventory />} />
      <Route path="/transfers"            element={<Transfers />} />
      <Route path="/content"              element={<Content />} />
      <Route path="/content/blog-posts"   element={<Content />} />
      <Route path="/content/menus"        element={<Content />} />
      <Route path="/content/files"        element={<Content />} />
      <Route path="/content/metaobjects"  element={<Content />} />
      <Route path="/discounts"            element={<Discounts />} />
      <Route path="/analytics"            element={<Analytics />} />
      <Route path="/pos"                  element={<POS />} />
      <Route path="/online-store"         element={<OnlineStore />} />

      {/* Collections tab lives inside Products — redirect legacy path */}
      <Route path="/collections" element={<Navigate to="/products" replace />} />

      {/* Catch-all unknown paths → dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Route>

  </Routes>
)

export default AppRoutes
