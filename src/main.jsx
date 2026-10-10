import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Invitation from "./Invitation.jsx";
import "./styles.css";

// GitHub Pages serves 404.html (a copy of index.html) for unknown paths,
// so deep links like /sayfa/2 still boot the SPA.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <Routes>
        {/* Pathless layout keeps the book mounted while pages change */}
        <Route element={<Invitation />}>
          <Route index element={null} />
          <Route path="sayfa/:no" element={null} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
