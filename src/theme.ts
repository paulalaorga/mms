import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// Configuración del modo oscuro
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

// Define tu tema personalizado
const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: "#f5faff",
      100: "#cce4ff",
      200: "#99ccff",
      300: "#66b3ff",
      400: "#3399ff",
      500: "#007fff",
      600: "#0066cc",
      700: "#004c99",
      800: "#003366",
      900: "#001a33",
    },
  },
});

export default theme;
