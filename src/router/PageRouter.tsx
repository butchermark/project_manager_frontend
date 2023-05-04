import { DashBoardPage } from "../components/pages/DashBoardPage";
import { LoginPage } from "../components/pages/LoginPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

export const PageRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashBoardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
