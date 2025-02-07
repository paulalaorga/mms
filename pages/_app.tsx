import "@/globals.css";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { appWithTranslation, useTranslation } from "next-i18next";
import AdminLayout from "../pages/admin/layout";
import UserLayout from "../pages/user/layout";
import theme from "../src/theme";
import "../src/config/i18n"; // Asegura que i18next se inicializa

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");
  const isUserRoute = router.pathname.startsWith("/user");
  const { i18n } = useTranslation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userLang = navigator.language.startsWith("en") ? "en" : "es";
      if (i18n.language !== userLang) {
        i18n.changeLanguage(userLang);
      }
    }
  }, [i18n]);

  return (
    <SessionProvider session={pageProps.session ?? null}>
      <ChakraProvider theme={theme}>
        {isAdminRoute ? (
          <AdminLayout>
            <Component {...pageProps} />
          </AdminLayout>
        ) : isUserRoute ? (
          <UserLayout>
            <Component {...pageProps} />
          </UserLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </ChakraProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(MyApp);
