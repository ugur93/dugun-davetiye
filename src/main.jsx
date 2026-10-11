import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Invitation from "./Invitation.jsx";
import Admin from "./Admin.jsx";
import { WEDDING } from "./content.js";
import "page-flip/src/Style/stPageFlip.css";
import "./styles.css";

// GitHub Pages serves 404.html (a copy of index.html) for unknown paths,
// so deep links like /sayfa/2 still boot the SPA.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

// Use a real parchment photo for the pages when one has been added.
if (WEDDING.paper) {
  const src = import.meta.env.BASE_URL + WEDDING.paper;
  const img = new Image();
  img.onload = () => {
    document.documentElement.style.setProperty("--paper", `url("${src}")`);
    document.documentElement.classList.add("real-paper");
  };
  img.src = src;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <Routes>
        {/* Pathless layout keeps the book mounted while pages change */}
        <Route element={<Invitation />}>
          <Route index element={null} />
          <Route path="sayfa/:no" element={null} />
        </Route>
        {/* hidden page for the couple: invites, links, answers */}
        <Route path="davetliler" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
