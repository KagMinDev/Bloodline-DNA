import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { NotFound } from "../components";
import { ForgotPasswordForm, Login, Register } from "../features";
import BlogDetail from "../features/customer/pages/BlogDetails";
import HomePage from "../features/home/pages/HomePage";
import AdminRouter from "./AdminRouter";
import CustomerRouter from "./CustomerRouter";
import ManagerRouter from "./ManagerRouter";
import StaffRouter from "./StaffRouter";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* router auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/" element={<HomePage />} />

        {/* Not found */}
        <Route path="*" element={<NotFound />} />

        {/* Các route khác */}
        <Route path="/staff/*" element={<StaffRouter />} />
        <Route path="/manager/*" element={<ManagerRouter />} />
        <Route path="/admin/*" element={<AdminRouter />} />
        <Route path="/customer/*" element={<CustomerRouter />} />
      </Routes>
    </Router>
  );
};

export default App;
