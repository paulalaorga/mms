import { Input as ChakraInput, InputGroup, InputLeftElement, InputProps, FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props extends InputProps {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

export default function Input({ label, icon, error, ...props }: Props) {
  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup>
        {icon && <InputLeftElement pointerEvents="none">{icon}</InputLeftElement>}
        <ChakraInput {...props} />
      </InputGroup>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}
