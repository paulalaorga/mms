import { Text as ChakraText, TextProps } from "@chakra-ui/react";

interface Props extends TextProps {
  variant?: "default" | "muted" | "bold";
}

export default function Text({ variant = "default", children, ...props }: Props) {
  const styles = {
    default: { fontWeight: "normal", color: "text.primary" },
    muted: { fontWeight: "light", color: "gray.500" },
    bold: { fontWeight: "bold", color: "text.primary" },
  };

  return <ChakraText {...styles[variant]} {...props}>{children}</ChakraText>;
}
