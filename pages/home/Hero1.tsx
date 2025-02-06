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

import NextLink from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react";

import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { FaRegPlayCircle } from "react-icons/fa";
import Image from "next/image";
import mountains from "../../public/mountains-mms.jpg";

export default function Hero1() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box position="relative" minH="100vh" display="flex" flexDirection="column">
      {/* Contenedor para la imagen de fondo */}
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
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
        pt={20}
      >
        <Heading
          size={{ base: "lg", md: "xl" }}
          textTransform="uppercase"
          mt={50}
          fontWeight="bold"
          color={"white"}
        >
          Somos el primer programa de recuperación
          <Text color="accent.50">100% online</Text>
          pero esque además somos muy buenos
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
          <Heading size="md">Conoce al equipo de MMS</Heading>
        </HStack>

        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
          <ModalOverlay />
          <ModalContent bg="black">
            <CloseButton color="white" onClick={onClose} />
            <ModalBody p={4} display="flex" justifyContent="center">
              <video width="100%" controls>
                <source src="/Presentacion_1.mp4" type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>

      <Box
        position="fixed" // Fijo en la pantalla
        bottom={150} // Distancia desde el borde inferior
        left="50%" // Lo centra horizontalmente
        transform="translateX(-50%)" // Ajuste para centrarlo correctamente
        alignItems="center"
        justifyContent="center"
        zIndex={1000} 
      >
        <NextLink href="/hero2" passHref legacyBehavior>
          <ChakraLink color="brand.50" _hover={{ color: "accent.50" }}>
            <HStack display="flex" flexDirection="column">
              <Heading size="sm" m={-3}>¿Cómo funciona MMS?</Heading>
              <Icon as={MdKeyboardDoubleArrowDown} color="brand.100" boxSize={10} />
            </HStack>
          </ChakraLink>
        </NextLink>
      </Box>
    </Box>
  );
}
