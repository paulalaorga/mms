import { Box, Container, Heading, Text, Flex } from "@chakra-ui/react";
import Hero3Card from "@/components/home/Hero3Card";
import grupoImg from "../../public/Programa-de-Grupo.jpg";
import individualImg from "../../public/Programa-Individual.jpg";
import familiaImg from "../../public/Programa-Familia.jpg";

export default function Hero3() {
  return (
    <div id="hero3">
      <Box
        bg="black.50"
        minHeight="100vh" // Permite que el contenido crezca si es necesario
        zIndex={2}
        position="relative"
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        mt={[10, 20]} // Espaciado dinámico en pantallas pequeñas y grandes
        px={[4, 8, 20]} // Padding más adaptable
        py={[10, 20]}
      >
        <Heading
          as="h1"
          fontSize={["28px", "36px", "44px"]} // Tamaños responsivos
          textTransform="uppercase"
          letterSpacing="wide"
          fontWeight="500"
          maxW="80%"
          pt={4}
          color="white"
        >
          ELIGE EL PROGRAMA QUE NECESITAS
        </Heading>

        <Flex flexDirection="column" alignItems="center">
          <Text as="p" color="white" mt={4} fontSize={["sm", "md", "lg"]}>
            MMS se adapta a tu individualidad, por eso hemos ideado una gama
            diversa de{" "}
            <Text as="span" fontWeight="bold" color="accent.50">
              programas terapéuticos
            </Text>{" "}
            que se ajustan a tus necesidades únicas.
          </Text>
        </Flex>

        <Container
          maxW="100%" // Para evitar desbordamientos
          display="flex"
          flexDirection={["column", "column","column", "row"]} // Columna en móviles, fila en escritorio
          alignItems="stretch"
          justifyContent="center"
          textAlign="center"
          position="relative"
          zIndex={1}
          gap={6}
          mt={10}
        >
          <Hero3Card
            image={grupoImg.src}
            program="FUNDAMENTAL"
            title="Terapia de Grupo"
            description="Sesiones grupales, pero con el enfoque siempre en ti y tu proceso individual de recuperación"
            programPage="/programa-de-grupo"
          />
          <Hero3Card
            image={individualImg.src}
            program="individual"
            title="programa personalizado"
            description="Adaptado a tus necesidades particulares, ofreciéndote un plan de recuperación personalizado"
            programPage="/programa-individual"
          />
          <Hero3Card
            image={familiaImg.src}
            program="Familia"
            title="Te ayudamos a ayudar"
            description="Te enseñamos a pedirle que acepte su situación, que acepte la ayuda que necesita y a encontrarla"
            programPage="/programa-familia"
          />
        </Container>
      </Box>
    </div>
  );
}
