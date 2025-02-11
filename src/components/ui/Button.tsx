import { Button as ChakraButton, ButtonProps, Spinner } from "@chakra-ui/react";

interface Props extends ButtonProps {
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
}

export const buttonStyles = {
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
    border: "1px solid",
    borderColor: "brand.200",
    color: "brand.200",
    _hover: { bg: "brand.200", color: "white" },
  },
};

export default function MyButton({ variant = "primary", isLoading, children, ...props }: Props) {
  return (
    <ChakraButton {...buttonStyles[variant]} {...props}>
      {isLoading ? <Spinner size="sm" /> : children}
    </ChakraButton>
  );
}
