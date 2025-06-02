import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Categories from "../pages/Categories";
import History from "../pages/History";
import Voucher from "../pages/Voucher";
import Settings from "../pages/SettingsPage";
import Cart from "../pages/Cart";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Home />} />
    <Route path="/categories" element={<Categories />} />
    <Route path="/history" element={<History />} />
    <Route path="/voucher" element={<Voucher />} />
    <Route path="/setting" element={<Settings />} />
    <Route path="/cart" element={<Cart />} />
  </Routes>
);

export default AppRoutes;
