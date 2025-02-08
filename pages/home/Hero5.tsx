import { Box, Heading, Container } from "@chakra-ui/react";
import FAQ from "@/components/ui/FAQ";

export default function Hero4() {
  return (
    <div id="hero4">
      <Box
        bg="white"
        height={"100vh"}
        zIndex={2}
        position={"relative"}
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
      >
        <Heading as="h1" fontSize={"3.25rem"}>
          Preguntas frecuentes
        </Heading>

        <Container
          minW={"100%"}
          display="flex"
          alignItems="stretch"
          justifyContent="center"
          textAlign="center"
          position="relative"
          zIndex={1}
          gap={6}
          mt={10} 
        >
          <FAQ />
        </Container>
      </Box>
    </div>
  );
}
