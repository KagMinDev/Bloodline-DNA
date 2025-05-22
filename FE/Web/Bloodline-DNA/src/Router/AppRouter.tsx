import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Login, Register } from "../features";
import HomePage from "../features/home/HomePage";
import AdminRouter from "./AdminRouter";
import StaffRouter from "./StaffRouter";
import ManagerRouter from "./ManagerRouter";


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* router auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<HomePage />} />

        {/* Các route khác */}
        <Route path="/staff/*" element={<StaffRouter />} />
        <Route path="/admin/*" element={<AdminRouter />} />
        <Route path="/manager/*" element={<ManagerRouter />} />

        {/* Bắt lỗi không tìm thấy pages */}
        <Route path="*" element={<h1>404</h1>} />

      </Routes>
    </Router>
  );
};

export default App;
