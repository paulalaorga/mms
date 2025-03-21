import { Box, Heading, Container } from "@chakra-ui/react";
import { LuUsers } from "react-icons/lu";
import { BsCalendarCheck } from "react-icons/bs";
import { MdOutlineVerifiedUser } from "react-icons/md";
import Hero2Card from "@/components/home/Hero2Card";

export default function Hero2() {
  return (
    <div id="hero2">
      <Box
        bg="white"
        minH={"80vh"}
        zIndex={2}
        position={"relative"}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        pt={"15%"}
      >
        <Heading
          as="h1"
          fontSize={["22px", "44px"]}
          textTransform="uppercase"
          letterSpacing={"wide"}
          fontWeight={"500"}
          maxW={"80%"}
          minH={"20vh"}
        
        >
          NADA DE COMPLICACIONES: 3 PASOS Y EMPIEZAS TU RECUPERACIÓN CON MMS AHORA MISMO
        </Heading>

        <Container
          width={["80vw", "80vw", "50vw", "80vw"]}
          display="flex"
          flexDirection={["column", "column", "column", "row"]}
          alignItems="stretch" // Asegura que todas las cajas tengan la misma altura
          justifyContent="center"
          textAlign="center"
          position="relative"
          zIndex={1}
          gap={["2","6"]} // Espaciado uniforme entre las cajas
        >
          <Hero2Card
            icon={<LuUsers fontSize="2.5rem" />}
            title="Habla con Rosa"
            description="Después de la charla, podrás completar tu matrícula en solo 5 minutos. Sin trámites complicados ni esperas, estarás listo para empezar de inmediato."
                    
            />
          <Hero2Card
            icon={<BsCalendarCheck fontSize="2.5rem" />}
            title="Haz la matrícula"
            description="Después de la charla, podrás completar tu matrícula en solo 5 minutos. Sin trámites complicados ni esperas, estarás listo para empezar de inmediato."        
            />
          <Hero2Card
            icon={<MdOutlineVerifiedUser fontSize="2.5rem" />}
            title="Entra a tu primera sesión"
            description="Una vez matriculado, accederás rápidamente a tu primera sesión grupal. Aquí empezarás a trabajar en tu recuperación con la guía de nuestros expertos."      
             />
        </Container>
      </Box>
    </div>
  );
}
