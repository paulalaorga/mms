import { Box, Heading, Container } from "@chakra-ui/react";
import FAQ from "@/components/ui/FAQ";

export default function Hero5() {
  return (
    <div id="hero5">
      <Box
        bg="white"
        minHeight="100vh" // Asegura que la sección se expanda correctamente
        zIndex={2}
        position="relative"
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        px={[4, 8, 20]} // Ajusta padding en diferentes dispositivos
        py={[10, 20]}
      >
        <Heading
          as="h1"
          fontSize={["2rem", "2.5rem", "3.25rem"]} // Ajuste de tamaño dinámico
          fontWeight="500"
          maxW="80%"
          whiteSpace="nowrap" // Evita saltos de línea en el título
          pt={4}
          color="black"
          overflow="hidden"
          textOverflow="ellipsis" // Previene cortes bruscos en el texto
        >
          Preguntas Frecuentes
        </Heading>

        <Container
          centerContent
          maxW={["90%", "80%", "container.lg"]} // Centra en móviles y ajusta en escritorio
          position="relative"
          zIndex={1}
          mt={10}
        >
          <FAQ />
        </Container>
      </Box>
    </div>
  );
}
