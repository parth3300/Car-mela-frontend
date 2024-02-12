import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CarList from "./Api/Car";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import About from "./components/About";
import CompanyList from "./Api/Company";
import Carowners from "./Api/Carowner";
import DealershipList from "./Api/Dealership";
import DealershipDetails from "./Api/DealershipDetails ";
import CarDetails from "./Api/CarDetails ";
import NotFound from "./components/NotFound";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/companies" element={<CompanyList />} />
        <Route path="/carowners" element={<Carowners />} />
        <Route path="/dealerships" element={<DealershipList />} />
        <Route path="/dealerships/:id" element={<DealershipDetails />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
  );
}

export default App;
