import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend"; // Cargar archivos JSON
import { default as nextI18NextConfig } from "../../next-i18next.config.cjs";

if (!i18n.isInitialized) { // Solo inicializa si no está inicializado
  i18n
    .use(HttpApi) // Permite cargar archivos JSON
    .use(initReactI18next)
    .init({
      ...nextI18NextConfig,
      fallbackLng: "es",
      debug: process.env.NODE_ENV === "development",
      interpolation: { escapeValue: false },
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json", // Ruta correcta de traducciones
      },
    });
}

export default i18n;
