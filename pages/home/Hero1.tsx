import {
  Box,
  Heading,
  Container,
  HStack,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  CloseButton,
  ModalBody,
  useDisclosure,
  Text,
  Flex
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link as ChakraLink } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { FaRegPlayCircle } from "react-icons/fa";
import Image from "next/image";
import mountains from "../../public/mountains-mms.jpg";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "es", ["hero1"])), // Carga las traducciones
    },
  };
};

export default function Hero1() {
  const { t, i18n} = useTranslation("hero1"); // Carga las traducciones desde hero1.json
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isClient, setIsClient] = useState(false);

  console.log("🌍 Idioma detectado por i18next:", i18n.language);
  console.log("🔍 Prueba de traducción:", t("heading"));

  
  const scrollToSection = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };
  
  useEffect(() => {
    setIsClient(true);
    
    // Detecta el idioma en localStorage o usa el que Next.js pasó por SSR
    const storedLang = localStorage.getItem("i18nextLng") || i18n.language;
  
    if (storedLang !== "en") {
      i18n.changeLanguage(storedLang);
    }
  }, [i18n]);
  
  return (
    <Box position="relative" height={["78vh", "80vh"]} width="100vw" display="flex" flexDirection="column">
      {/* Contenedor para la imagen de fondo */}
      <Box position="absolute" top={0} left={0} width="100%" height="100%" zIndex={-1}>
        <Image src={mountains} alt="MMS" fill style={{ objectFit: "cover" }} />

        {/* Overlay para oscurecer la imagen */}
        <Box position="absolute" top={0} left={0} width="100%" height="100%" bg="rgba(0, 0, 0, 0.5)" zIndex={0} />
      </Box>

      <Container
        minH="80vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        position="relative"
        zIndex={1}
        maxW="90vw"
      >
        <Flex
          direction="column"
          align="center"
          textAlign="center"
          width="-webkit-fill-available"
        >
           <Box  minW="90%">
        <Heading 
        fontSize={["34px", "46px", "68px"]}
        textTransform="uppercase"
        color="white"
        textAlign="center"
        letterSpacing={["0.5px", "1px", "2px"]}
        whiteSpace="normal" // Permite que el texto se adapte
      >
          {isClient ? t("heading") : "Cargando..."}
          </Heading>
          <Heading
              fontSize={["42px", "48px", "84px"]}
              color="accent.50"
              fontWeight="bolder"
              textTransform="uppercase"
              textAlign="center"
              letterSpacing={["3px", "3px", "6px", "46px"]}
              maxWidth="100%"
              display="block"
              mt={2}
            >100% online
            </Heading>
            </Box>
            
          <Heading
          fontSize={["24px", "32px", "40px"]}
          textTransform="uppercase"
          fontWeight="bold"
          color="white"
          textAlign="center"
          mt={3}
        >
          {isClient ? t("subheading") : "Cargando..."}
        </Heading>
    

        <HStack
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          onClick={onOpen}
          spacing={4}
          color="accent.50"
          cursor="pointer"
          _hover={{ color: "accent.100" }}
        >
          <Icon as={FaRegPlayCircle} boxSize={8} />
          <Text fontSize={["18px", "24px"]} fontWeight="bolder">{isClient ? t("team") : "Cargando..."}</Text>
        </HStack>

        <Box
        position="absolute"
        bottom={4}
        left="50%"
        transform="translateX(-50%)"
        alignItems="center"
        justifyContent="center"
        zIndex={2}
      >
          <ChakraLink  onClick={scrollToSection} color="brand.50" _hover={{ color: "accent.50" }}>
            <HStack display="flex" flexDirection="column">
              <Heading fontSize={["14px", "16px"]}>{isClient ? t("how_it_works") : "Cargando..."}</Heading>
              <Icon as={MdKeyboardDoubleArrowDown} color="brand.100" boxSize={[6, 8]} // Reduce tamaño en móvil
              mt={-2} />
            </HStack>
          </ChakraLink>
      </Box>
      </Flex>
      

        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
          <ModalOverlay />
          <ModalContent bg="black">
            <CloseButton color="white" onClick={onClose} />
            <ModalBody display="flex" justifyContent="center">
              <video width="100%" controls>
                <source src="/Presentacion_1.mp4" type="video/mp4" />
                {isClient ? ("video_error") : "Cargando..."}
              </video>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
      </Box>
      
  );
}
