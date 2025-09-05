import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Firebase
import { Toaster } from 'react-hot-toast';

// Components
import NavBar from './Components/NavBar.jsx';
import Footer from './Components/Footer.jsx';
import ScrollToTop from './Components/ScrollToTop.jsx';

// Public Pages
import Home from './Pages/Home.jsx';
import Services from './Pages/Services.jsx';
import About from './Pages/About.jsx';
import Booking from './Pages/Booking.jsx';
import Products from './Pages/Products.jsx';
import Contact from './Pages/Contact.jsx';
import PrivacyPolicy from './Pages/PrivacyPolicy.jsx';
import TermsAndConditions from './Pages/TermsAndConditions.jsx';
import PackageDetails from './Pages/PackageDetails.jsx';
import Offers from './Pages/Offers.jsx';
import MyOrders from './Pages/MyOrders.jsx';
import Login from './Pages/Login.jsx';

// Seller Pages
import SellerDashBoard from './Pages/seller/SellerDashBoard.jsx';
import Orders from './Pages/seller/Orders.jsx';
import Overview from './Pages/seller/Overview.jsx';
import AddServices from './Pages/seller/AddServices.jsx';
import AddPackages from './Pages/seller/AddPackages.jsx';
import AddCategory from './Pages/seller/AddCategory.jsx';
import AddOffer from './Pages/seller/AddOffer.jsx';

// Protected Route
import ProtectedRoute from './Components/ProtectedRoute.jsx';

const App = () => {
  const location = useLocation();
  const isSellerPage = location.pathname.startsWith('/seller');
  const isLoginPage = location.pathname === '/login';

  return (
    
    <AuthProvider>
      <Toaster position="top-right" />
      {!isSellerPage && !isLoginPage && <NavBar />}
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:type/:id" element={<Products />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/package/:id" element={<PackageDetails />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/login" element={<Login />} />

        {/* Seller Protected Routes */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute requiredRole="seller">
              <SellerDashBoard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Orders />} />
          <Route path="list-services" element={<Overview />} />
          <Route path="add-services" element={<AddServices />} />
          <Route path="add-package" element={<AddPackages />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="add-offer" element={<AddOffer />} />
        </Route>
      </Routes>
      {!isSellerPage && !isLoginPage && <Footer />}
    </AuthProvider>
  );
};

export default App;
