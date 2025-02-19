"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import theme from "@/theme"; // Importa el tema corregido

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
          <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
