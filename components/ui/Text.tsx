import { Text as ChakraText, TextProps } from "@chakra-ui/react";
import { ResponsiveValue } from "@chakra-ui/react";

interface Props extends TextProps {
  variant?: "default" | "muted" | "bold" | "menu" | "heading" | "accent";
}

export default function Text({ variant = "default", children, ...props }: Props) {
  const styles = {
    default: { 
      fontWeight: "normal", 
      color: "text.default",
      fontFamily: "body"
    },
    muted: { 
      fontWeight: "light", 
      color: "gray.500",
      fontFamily: "body" 
    },
    bold: { 
      fontWeight: "bold", 
      color: "text.default",
      fontFamily: "body" 
    },
    menu: { 
      fontWeight: "bold", 
      color: "white", 
      transition: "opacity 0.3s",
      ml: 3,
      fontFamily: "body",
      _hover: { 
        color: "brand.50" 
      } 
    },
    heading: { 
      fontWeight: "bold", 
      fontSize: "xl", 
      color: "brand.200",
      fontFamily: "heading",
      textTransform: "uppercase" as ResponsiveValue<"uppercase">,
      letterSpacing: "wide",
      mb: 2
    },
    accent: {
      fontWeight: "medium",
      color: "accent.50",
      fontFamily: "body"
    }
  };

  return <ChakraText {...styles[variant]} {...props}>{children}</ChakraText>;
}