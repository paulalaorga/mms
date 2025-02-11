import { Box, Text } from "@chakra-ui/react";

interface HeroCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Hero2Card: React.FC<HeroCardProps> = ({ icon, title, description }) => {
  return (
    <Box
      flex="1" // Hace que todos tengan el mismo ancho
      minH="300px" // Asegura que todas las cajas tengan la misma altura
      maxWidth="350px" // Mantiene uniformidad
      minWidth="280px" // Evita que se hagan muy pequeñas en móviles
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg="white"
      p={6}
    >
      {/* Ícono */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        color={"secondary.100"}
        mb={4} 
      >
        {icon} 
      </Box>

      {/* Título */}
      <Box display="flex" alignItems="center" justifyContent="center" flex="1">
        <Text variant="bold" as="h2" fontSize={"2xl"} color="black">
          {title}
        </Text>
      </Box>

      {/* Descripción */}
      <Box flex="2" display="flex" alignItems="center">
        <Text color={"grey"} mt={3}>
          {description}
        </Text>
      </Box>
    </Box>
  );
};

export default Hero2Card;
