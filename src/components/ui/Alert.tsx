import { Alert as ChakraAlert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";

interface Props {
  status: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
}

export default function Alert({ status, title, description }: Props) {
  return (
    <ChakraAlert status={status} borderRadius="md">
      <AlertIcon />
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </ChakraAlert>
  );
}
