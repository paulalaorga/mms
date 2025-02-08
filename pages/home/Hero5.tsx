import { Box, Heading, Container } from "@chakra-ui/react";
import FAQ from "@/components/ui/FAQ";

export default function Hero5() {
  return (
    <div id="hero5">
      <Box
        bg="white"
        height={"100%"}
        zIndex={2}
        position={"relative"}
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
      >
        <Heading as="h1" fontSize={"3.25rem"} fontWeight={"500"} maxW={"80%"} pt={4} color={"black"}>
          Preguntas frecuentes
        </Heading>

        <Container centerContent maxW={"container.lg"}
          position={"relative"}
          zIndex={1}
          mt={10} 
          mb={100}
        >
          <FAQ />
        </Container>
      </Box>
    </div>
  );
}
