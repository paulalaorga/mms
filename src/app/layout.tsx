"use client";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme"; // Importa el tema corregido

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </body>
    </html>
  );
}
