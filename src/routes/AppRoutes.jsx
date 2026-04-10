import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage/LandingPage';
import Login from '../pages/Login/Login';
import POS from '../pages/POS/POS';
import Orders from '../pages/Orders/Orders';
import Inventory from '../pages/Inventory/Inventory';
import Dashboard from '../pages/Dashboard/Dashboard';
import OnlineStore from '../pages/OnlineStore/OnlineStore';
import Products from '../pages/Products/Products';
import Collections from '../pages/Collections/Collections';
import Customers from '../pages/Customers/Customers';
import Analytics from '../pages/Analytics/Analytics';
import Register from '../pages/Register/Register';
import MainLayout from '../components/layout/MainLayout/MainLayout';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/*" element={
        <MainLayout>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/online-store" element={<OnlineStore />} />
          </Routes>
        </MainLayout>
      } />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;