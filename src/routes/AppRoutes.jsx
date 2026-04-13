import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '../pages/LandingPage/LandingPage'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import POS from '../pages/POS/POS'
import Orders from '../pages/Orders/Orders'
import Inventory from '../pages/Inventory/Inventory'
import Dashboard from '../pages/Dashboard/Dashboard'
import OnlineStore from '../pages/OnlineStore/OnlineStore'
import Products from '../pages/Products/Products'
import Collections from '../pages/Collections/Collections'
import Transfers from '../pages/Transfers/Transfers'
import Customers from '../pages/Customers/Customers'
import Content from '../pages/Content/Content'
import Analytics from '../pages/Analytics/Analytics'
import MainLayout from '../components/layout/MainLayout/MainLayout'

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>

      {/* Public routes — no sidebar */}
      <Route path="/"         element={<LandingPage />} />
      <Route path="/landing"  element={<LandingPage />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes — with sidebar via MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/products"    element={<Products />} />
        <Route path="/orders"      element={<Orders />} />
        <Route path="/customers"   element={<Customers />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/inventory"   element={<Inventory />} />
        <Route path="/transfers"   element={<Transfers />} />
        <Route path="/content"                  element={<Content />} />
        <Route path="/content/blog-posts"       element={<Content />} />
        <Route path="/content/menus"            element={<Content />} />
        <Route path="/content/files"            element={<Content />} />
        <Route path="/content/metaobjects"      element={<Content />} />
        <Route path="/analytics"   element={<Analytics />} />
        <Route path="/pos"         element={<POS />} />
        <Route path="/online-store"element={<OnlineStore />} />
      </Route>

    </Routes>
  </BrowserRouter>
)

export default AppRoutes