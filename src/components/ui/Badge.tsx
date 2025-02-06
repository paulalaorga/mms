import { Badge as ChakraBadge } from "@chakra-ui/react";

interface Props {
  text: string;
  variant?: "success" | "warning" | "error" | "info";
}

export default function Badge({ text, variant = "info" }: Props) {
  const colors = {
    success: "green.500",
    warning: "yellow.500",
    error: "red.500",
    info: "blue.500",
  };

  return (
    <ChakraBadge colorScheme={colors[variant]} p={1} borderRadius="md">
      {text}
    </ChakraBadge>
  );
}
