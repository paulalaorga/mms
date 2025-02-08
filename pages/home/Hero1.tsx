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
  Flex,
} from "@chakra-ui/react";

import { Link as ChakraLink } from "@chakra-ui/react";

import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { FaRegPlayCircle } from "react-icons/fa";
import Image from "next/image";
import mountains from "../../public/mountains-mms.jpg";

export default function Hero1() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const scrollTo = () => {
    setTimeout(() => {
      const section = document.getElementById("hero2");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.warn("No se encontró la sección hero2");
      }
    }, 100);
  };

  return (
    <Box position="relative" minH="100vh" display="flex" flexDirection="column">
      {/* Contenedor para la imagen de fondo */}
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="69.5%"
        zIndex={-1}
      >
        {/* Imagen de fondo */}
        <Image src={mountains} alt="MMS" fill style={{ objectFit: "cover" }} />

        {/* Overlay para oscurecer la imagen */}
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bg="rgba(0, 0, 0, 0.5)" // Oscurecimiento
          zIndex={0}
        />
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
        pt={10}
      >
        <Flex
          direction="column"
          align="center"
          alignItems={"center"}
          textAlign="center"
          mt={50}
          width="100%"
        >
          {/* Contenedor con maxWidth para controlar el ancho */}
          <Box textAlign="center" maxWidth="fit-content">
            <Heading
              fontSize={["32px", "42px", "52px"]}
              textTransform="uppercase"
              color="white"
              textAlign="center"
              whiteSpace="nowrap"
              letterSpacing={["1px", "2px", "3px", "4px"]} // Ajusta el espaciado
            >
              Somos el primer programa de recuperación
            </Heading>

            {/* "100% online" con letterSpacing dinámico y maxWidth */}
            <Heading
              fontSize={["42px", "52px", "72px"]}
              color="accent.50"
              fontWeight="bolder"
              textTransform="uppercase"
              textAlign="center"
              whiteSpace="nowrap"
              letterSpacing={["6px", "16px", "26px", "36px"]} // Ajusta el espaciado
              maxWidth="100%"
              minWidth="100%" // Nunca más ancho que el Heading de arriba
              display="block"
            >
              100% online
            </Heading>
          </Box>

          <Heading
            fontSize={["28px", "36px", "42px"]}
            textTransform="uppercase"
            fontWeight="bold"
            color="white"
            textAlign="center"
            mt={4}
          >
            pero es que además somos muy buenos
          </Heading>

          <HStack
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            onClick={onOpen}
            mt={4}
            color="accent.50"
            cursor="pointer"
            _hover={{ color: "accent.100" }}
          >
            <Icon as={FaRegPlayCircle} boxSize={8} />
            <Text fontSize={"24px"} fontWeight={"bolder"}>
              Conócenos
            </Text>
          </HStack>
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
          <ModalOverlay />
          <ModalContent bg="black">
            <CloseButton color="white" onClick={onClose} />
            <ModalBody display="flex" justifyContent="center">
              <video width="100%" controls>
                <source src="/Presentacion_1.mp4" type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>

      <Box
        position="absolute" // Fijo en la pantalla
        bottom={210} // Distancia desde el borde inferior
        left="50%" // Lo centra horizontalmente
        transform="translateX(-50%)" // Ajuste para centrarlo correctamente
        alignItems="center"
        justifyContent="center"
        zIndex={10}
      >
        <ChakraLink
          color="brand.50"
          _hover={{ color: "brand.200" }}
          onClick={scrollTo}
        >
          <HStack display="flex" flexDirection="column">
            <Text>¿Cómo funciona MMS?</Text>
            <Icon
              as={MdKeyboardDoubleArrowDown}
              color="brand.200"
              boxSize={8}
              mt={-2}
            />
          </HStack>
        </ChakraLink>
      </Box>
    </Box>
  );
}
