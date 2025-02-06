import { Button as ChakraButton, ButtonProps, Spinner } from "@chakra-ui/react";

interface Props extends ButtonProps {
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
}

export default function MyButton({ variant = "primary", isLoading, children, ...props }: Props) {
  const styles = {
    primary: {
      bg: "brand.200",
      color: "white",
      _hover: { bg: "brand.100" },
    },
    secondary: {
      bg: "secondary.200",
      color: "white",
      _hover: { bg: "secondary.100" },
    },
    outline: {
      border: "2px solid",
      borderColor: "brand.200",
      color: "brand.200",
      _hover: { bg: "brand.50", color: "white" },
    },
  };

  return (
    <ChakraButton {...styles[variant]} {...props}>
      {isLoading ? <Spinner size="sm" /> : children}
    </ChakraButton>
  );
}
