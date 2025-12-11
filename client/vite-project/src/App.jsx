import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import BookingMapPage from './pages/BookingMapPage';
import BookingPage from './pages/BookingPage'; // Keep for reference if needed
import TripsPage from './pages/TripsPage';
import WalletPage from './pages/WalletPage';
import DriverDashboard from './pages/DriverDashboard';
import ChatBot from './components/ChatBot';

const HomePage = () => {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </>
  );
};


import BackendTest from './components/BackendTest';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="font-sans antialiased text-gray-900 bg-white">
          <BackendTest />
          <Navbar />
          <ChatBot />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/book-ride" element={<BookingMapPage />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/driver-dashboard" element={<DriverDashboard />} />
            </Route>

          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
