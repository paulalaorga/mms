import { Box, Heading, Container } from "@chakra-ui/react";
import { LuUsers } from "react-icons/lu";
import { BsCalendarCheck } from "react-icons/bs";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { useTranslation } from "next-i18next";
import Hero2Card from "@/components/home/Hero2Card";

export default function Hero2() {
  const { t } = useTranslation("hero2"); 
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
          {t("heading")}
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
            title={t("step1_title")}
            description={t("step1_desc")}  
                    
            />
          <Hero2Card
            icon={<BsCalendarCheck fontSize="2.5rem" />}
            title={t("step2_title")}
            description={t("step2_desc")}          
            />
          <Hero2Card
            icon={<MdOutlineVerifiedUser fontSize="2.5rem" />}
            title={t("step3_title")}
            description={t("step3_desc")}         
             />
        </Container>
      </Box>
    </div>
  );
}
