import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { NotFound } from "../components";
import { ForgotPassword, Login, Register } from "../features";
import HomePage from "../features/home/pages/HomePage";
import AdminRouter from "./AdminRouter";
import StaffRouter from "./StaffRouter";
import { Services } from "../features/services/pages/Services";
import { DetailServices } from "../features/services/pages/DetailServices";
import { Doctors } from "../features/services/pages/Doctors";
import { Contacts } from "../features/services/pages/Contacts";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* router auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<DetailServices />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/contacts" element={<Contacts />} />

        {/* Not found */}
        <Route path="*" element={<NotFound />} />

        {/* Các route khác */}
        <Route path="/staff/*" element={<StaffRouter />} />
        <Route path="/admin/*" element={<AdminRouter />} />
      </Routes>
    </Router>
  );
};

export default App;
