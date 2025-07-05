import React from "react";
import { Route, Routes } from "react-router-dom";
import { NotFound } from "../components";
import { ForgotPasswordForm, Login, Register } from "../features";
import HomePage from "../features/home/pages/HomePage";
import AdminRouter from "./AdminRouter";
import CustomerRouter from "./CustomerRouter";
import ManagerRouter from "./ManagerRouter";
import StaffRouter from "./StaffRouter";
// The customer imports are no longer needed here as they are handled in CustomerRouter
// import { Blogs, Contacts, DetailServices, Doctors, Services } from "../features/customer";
// import BlogDetail from "../features/customer/pages/BlogDetails";

const App: React.FC = () => {
  return (
    <Routes>
      {/* router auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      
      {/* Homepage route */}
      <Route path="/" element={<HomePage />} />

      {/* Role-based routers */}
      <Route path="/staff/*" element={<StaffRouter />} />
      <Route path="/manager/*"element={<ManagerRouter />} />
      <Route path="/admin/*" element={<AdminRouter />} />
      <Route path="/customer/*" element={<CustomerRouter />} />

      {/* Not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
