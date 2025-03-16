import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import CarList from "./Api/Car/Car";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import About from "./components/About";
import CompanyList from "./Api/Company/Company";
import Carowners from "./Api/Carowner/Carowner";
import DealershipList from "./Api/Dealership/Dealership";
import CarDetails from "./Api/Car/CarDetails ";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";  // ✅ Import Auth Context

const AuthRedirect = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <AuthProvider>  {/* ✅ Wrap entire app with AuthProvider */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/companies" element={<CompanyList />} />
          <Route path="/carowners" element={<Carowners />} />
          <Route path="/dealerships" element={<DealershipList />} />
          
          {/* Redirect logged-in users from Login & Signup */}
          <Route path="/signup" element={<AuthRedirect><Signup /></AuthRedirect>} />
          <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
          
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
