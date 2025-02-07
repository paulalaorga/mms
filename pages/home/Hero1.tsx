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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import NextLink from "next/link";
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

  

  useEffect(() => {
    setIsClient(true);
    if (i18n.language !== "en") {
      i18n.changeLanguage("en");
    }
  }, [i18n]);

  return (
    <Box position="relative" minH="100vh" display="flex" flexDirection="column">
      {/* Contenedor para la imagen de fondo */}
      <Box position="absolute" top={0} left={0} width="100%" height="100%" zIndex={-1}>
        <Image src={mountains} alt="MMS" fill style={{ objectFit: "cover" }} />

        {/* Overlay para oscurecer la imagen */}
        <Box position="absolute" top={0} left={0} width="100%" height="100%" bg="rgba(0, 0, 0, 0.5)" zIndex={0} />
      </Box>

      <Container
        maxW="container.lg"
        minH="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        textAlign="center"
        position="relative"
        zIndex={1}
        px={4}
        pt={20}
      >
        <Heading size={{ base: "lg", md: "xl" }} textTransform="uppercase" mt={50} fontWeight="bold" color={"white"}>
          {isClient ? t("heading") : "Cargando..."}
          <Text color="accent.50">{isClient ? t("online") : "Cargando..."}</Text>
          {isClient ? t("subheading") : "Cargando..."}
        </Heading>

        <HStack
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          onClick={onOpen}
          spacing={4}
          mt={8}
          color="accent.50"
          cursor="pointer"
          _hover={{ color: "accent.100" }}
        >
          <Icon as={FaRegPlayCircle} boxSize={8} />
          <Heading size="md">{isClient ? t("team") : "Cargando..."}</Heading>
        </HStack>

        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
          <ModalOverlay />
          <ModalContent bg="black">
            <CloseButton color="white" onClick={onClose} />
            <ModalBody p={4} display="flex" justifyContent="center">
              <video width="100%" controls>
                <source src="/Presentacion_1.mp4" type="video/mp4" />
                {isClient ? ("video_error") : "Cargando..."}
              </video>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>

      <Box
        position="fixed"
        bottom={150}
        left="50%"
        transform="translateX(-50%)"
        alignItems="center"
        justifyContent="center"
        zIndex={1000}
      >
        <NextLink href="/hero2" passHref legacyBehavior>
          <ChakraLink color="brand.50" _hover={{ color: "accent.50" }}>
            <HStack display="flex" flexDirection="column">
              <Heading size="sm" m={-3}>{isClient ? t("how_it_works") : "Cargando..."}</Heading>
              <Icon as={MdKeyboardDoubleArrowDown} color="brand.100" boxSize={10} />
            </HStack>
          </ChakraLink>
        </NextLink>
      </Box>
    </Box>
  );
}
