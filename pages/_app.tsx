import "@/globals.css";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import AdminLayout from "../pages/admin/layout"; // Layout de Admin
import UserLayout from "../pages/user/layout"; // Layout de Usuario
import theme from "../src/theme"; // Importa el tema corregido

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");
  const isUserRoute = router.pathname.startsWith("/user");

  return (
    <SessionProvider session={pageProps.session}>
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
