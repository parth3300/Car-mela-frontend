import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import CarList from "./Api/Car/Car";
import Home from "./components/features/home/Home";
import Navbar from "./components/layout/Navbar";
import Signup from "./components/auth/Signup";
import About from "./components/features/about/About";
import CompanyList from "./Api/Company/Company";
import Carowners from "./Api/Carowner/Carowner";
import DealershipList from "./Api/Dealership/Dealership";
import CarDetails from "./Api/Car/CarDetails ";
import NotFound from "./components/common/NotFound";
import Login from "./components/auth/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";  // ✅ Import Auth Context
import Footer from "./components/layout/Footer";
import PaymentSuccess from "./components/features/payment/PaymentSuccess";
import PaymentCanceled from "./components/features/payment/PaymentCanceled";
import Support from "./components/features/support/Support";
import Customers from "./Api/Customers/Customer";
import { Toaster } from "react-hot-toast";

const AuthRedirect = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<CarList />} />
              <Route path="/cars/:id" element={<CarDetails />} />
              <Route path="/companies" element={<CompanyList />} />
              <Route path="/carowners" element={<Carowners />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/dealerships" element={<DealershipList />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-canceled" element={<PaymentCanceled />} />
              <Route path="/support" element={<Support />} />
              
              {/* Redirect logged-in users from Login & Signup */}
              <Route path="/signup" element={<AuthRedirect><Signup /></AuthRedirect>} />
              <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
              
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderRadius: '0.5rem',
              padding: '1rem',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
