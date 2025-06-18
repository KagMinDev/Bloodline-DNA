import React from "react";
import { Route, Routes } from "react-router-dom";
import { NotFound } from "../components";
import { ForgotPassword, Login, Register } from "../features";
import HomePage from "../features/home/pages/HomePage";
import AdminRouter from "./AdminRouter";
import CustomerRouter from "./CustomerRouter";
import ManagerRouter from "./ManagerRouter";
import StaffRouter from "./StaffRouter";
const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* router auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/" element={<HomePage />} />
      
      {/* Not found */}
      <Route path="*" element={<NotFound />} />

      {/* Các route khác */}
      <Route path="/staff/*" element={<StaffRouter />} />
      <Route path="/manager/*" element={<ManagerRouter />} />
      <Route path="/admin/*" element={<AdminRouter />} />
      <Route path="/customer/*" element={<CustomerRouter />} />
    </Routes>
  );
};

export default AppRouter;
