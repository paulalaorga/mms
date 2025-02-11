import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// Configuración del modo oscuro
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};


// Define tu tema personalizado
const theme = extendTheme({
  config,
  fonts: {
    heading: `"Bebas Neue", sans-serif`, // Fuente para el cuerpo
    body: `"Roboto", sans-serif`, // Fuente para los encabezados
  },
  styles: {
    global: {
      "html, body": {
        fontFamily: "body",
      },
      "h1, h2, h3, h4, h5, h6": {
        fontFamily: "heading",
      },
    },
  },
  colors: {
      brand: {
        50: "#31989c",
        100: "#27787b",
        150: "#1f6062",
        200: "#1a5052", // Base color
        250: "#154042",
      },
      secondary: {
        50: "#ffcb28",
        100: "#ffa020",
        150: "#ff8019",
        200: "#fa6b15", // Base color
        250: "#c85611",
      },
      black: {
        50: "#202020",
        100: "#000000",
        150: "#000000",
        200: "#000000", // Base color
        250: "#000000",
      },
      accent: {
        50: "#ff6733",
        100: "#ff5128",
        150: "#ff4120",
        200: "#ff361b", // Base color
        250: "#cc2b16",
      },
    },
    semanticTokens: {
      colors: {
        text: {
          default: "#111827",
          _dark: "#F9FAFB",
        },
        background: {
          default: "#F9FAFB",
          _dark: "#1A202C",
        },
        primary: {
          default: "brand.200",
          _dark: "brand.100",
        },
        secondary: {
          default: "secondary.200",
          _dark: "secondary.100",
        },
      },
    },
  });

export default theme;
