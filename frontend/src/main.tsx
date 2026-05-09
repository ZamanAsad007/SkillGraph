import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/shared/AppLayout";
import { AdminDashboard } from "./pages/AdminDashboard";
import { CareerFair } from "./pages/CareerFair";
import { CareerGPS } from "./pages/CareerGPS";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Matchmaker } from "./pages/Matchmaker";
import { MentorMatch } from "./pages/MentorMatch";
import { Notifications } from "./pages/Notifications";
import { PublicGalaxy } from "./pages/PublicGalaxy";
import { Resources } from "./pages/Resources";
import { Settings } from "./pages/Settings";
import { WhatIfSimulator } from "./pages/WhatIfSimulator";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/galaxy/:handle" element={<PublicGalaxy />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/career-gps" element={<CareerGPS />} />
          <Route path="/matchmaker" element={<Matchmaker />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/simulator" element={<WhatIfSimulator />} />
          <Route path="/career-fair" element={<CareerFair />} />
          <Route path="/mentors" element={<MentorMatch />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
