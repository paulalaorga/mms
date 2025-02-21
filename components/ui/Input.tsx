import { Input as ChakraInput, InputGroup, InputLeftElement, InputProps, FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props extends InputProps {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

export default function Input({ label, icon, error, ...props }: Props) {
  return (
    <FormControl isInvalid={!!error}> {/* ✅ Aplica el estado de error */}
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup>
        {icon && <InputLeftElement pointerEvents="none">{icon}</InputLeftElement>}
        <ChakraInput
          {...props}
          borderColor={error ? "red.500" : "gray.300"} // ✅ Cambia el borde si hay error
          _focus={{ borderColor: error ? "red.500" : "blue.500" }} // ✅ Mantiene rojo en foco si hay error
          _invalid={{ borderColor: "red.500", backgroundColor: "red.50" }} // ✅ Asegura el color en estado de error
        />
      </InputGroup>
      {error && <FormErrorMessage>{error}</FormErrorMessage>} {/* ✅ Muestra el mensaje de error debajo */}
    </FormControl>
  );
}
