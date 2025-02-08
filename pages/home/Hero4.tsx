import { Box, Heading, Container } from "@chakra-ui/react";
import VideoCard from "@/components/ui/VideoCard";
import manImg1 from "../../public/man_7914.jpeg";
import manImg2 from "../../public/man-38.jpg";
import manImg3 from "../../public/man-1867175_1280.jpg";

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
        top={100}
      >
        <Heading
          as="h1"
          fontSize={"44px"}
          textTransform="uppercase"
          letterSpacing={"wide"}
          fontWeight={"500"}
          maxW={"80%"}
         
        >
          ELLOS LO HAN LOGRADO, ¡TÚ TAMBIÉN PUEDES!
        </Heading>

        <Container
          minW={"100%"}
          display="flex"
          alignItems="stretch"
          justifyContent="center"
          textAlign="center"
          position="relative"
          zIndex={1}
          pt={10}
          gap={6}
        >
          <VideoCard
            thumbnail={manImg1.src}
            videoUrl="/Testimonio-Alfonso.mp4"
          />
          <VideoCard
            thumbnail={manImg2.src}
            videoUrl="/Testimonio-Dani.mp4"
          />
          <VideoCard
            thumbnail={manImg3.src}
            videoUrl="/Testimonio-Raul.mp4"
          />
        </Container>
      </Box>
    </div>
  );
}
