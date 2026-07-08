import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { I18nProvider } from "./i18n/context";
import { SettingsProvider } from "./contexts/SettingsContext";
import { AuthProvider } from "./firebase/context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <AuthProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </AuthProvider>
    </I18nProvider>
  </StrictMode>
);
