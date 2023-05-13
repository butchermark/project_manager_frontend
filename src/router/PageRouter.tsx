import { useContext } from "react";
import { DashBoardPage } from "../components/pages/DashBoardPage";
import { LoginPage } from "../components/pages/LoginPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProjectManagerContext from "../context/ProjectManagerContext";
import { UserManagementPage } from "../components/pages/UserManagementPage";
import { ProjectManagementPage } from "../components/pages/ProjectManagementPage";
import { TaskManagementPage } from "../components/pages/TaskManagementPage";
import { ProjectPage } from "../components/pages/ProjectPage";

export const PageRouter = () => {
  const { accessToken } = useContext(ProjectManagerContext);
  const getAccessToken = localStorage.getItem("accessToken");
  return (
    <BrowserRouter>
      {getAccessToken ? (
        <Routes>
          <Route path="/taskmanagement" element={<TaskManagementPage />} />
          <Route
            path="/projectmanagement"
            element={<ProjectManagementPage />}
          />
          <Route path="/usermanagement" element={<UserManagementPage />} />
          <Route path="/dashboard" element={<DashBoardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/project/:projectid" element={<ProjectPage />} />
          <Route path="/project/:projectid/*" element={<ProjectPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/taskmanagement" element={<Navigate to="/" />} />
          <Route path="/projectmanagement" element={<Navigate to="/" />} />
          <Route path="/usermanagement" element={<Navigate to="/" />} />
          <Route path="/dashboard" element={<Navigate to="/" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/project/:projectid" element={<Navigate to="/" />} />
          <Route path="/project/:projectid/*" element={<Navigate to="/" />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};
