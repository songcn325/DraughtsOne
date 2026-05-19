import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import { AppShell } from "./components/AppShell";
import { AiProfilePage } from "./pages/AiProfilePage";
import { GameBoardPage } from "./pages/GameBoardPage";
import { LearnPage } from "./pages/LearnPage";
import { LoginPage } from "./pages/LoginPage";
import { MatchHistoryPage } from "./pages/MatchHistoryPage";
import { PlayHallPage } from "./pages/PlayHallPage";
import { ProfilePage } from "./pages/ProfilePage";
import { TrainPage } from "./pages/TrainPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/play" replace />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/train" element={<TrainPage />} />
          <Route path="/play" element={<PlayHallPage />} />
          <Route path="/game/:gameId" element={<GameBoardPage />} />
          <Route path="/ai" element={<AiProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/matches" element={<MatchHistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
