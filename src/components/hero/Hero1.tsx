import {
  Box,
  Heading,
  Container,
  HStack,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Text,
} from "@chakra-ui/react";

import NextLink from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react";

import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { FaRegPlayCircle } from "react-icons/fa";

export default function Hero1() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      position="relative"
      py={16}
      px={6}
      textAlign="center"
      bgImage="url('/mountains-mms.jpg')" // ✅ Se quita "/public"
      bgSize="cover" // ⬅️ La imagen cubre todo el espacio
      bgPosition="top"
      bgRepeat="no-repeat"
      color="white"
      width="100%"
      minHeight="80vh" // ⬅️ Esto asegura una altura consistente
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      overflow="hidden" // ⬅️ Evita que el filtro afecte otros elementos
      _before={{
        content: '""',
        position: "absolute",
        width: "100%",
        height: "100%",
        bg: "blackAlpha.600", // ⬅️ Aplica filtro oscuro SOLO al Hero
        zIndex: 1,
      }}
    >
      {/* Contenido sobre el filtro */}
      <Container maxW="container.lg" position="relative" zIndex={1}>
        <Heading size="xl" textTransform="uppercase" fontWeight="bold">
          Somos el primer programa de recuperación{""}
          <Text color="accent.50">100% online</Text> y además somos muy buenos
        </Heading>
        <HStack
          alignItems="center" // Asegura alineación vertical de los elementos dentro del HStack
          justifyContent="center" // Centra el HStack dentro del contenedor padre
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

        
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent bg="black">
          <ModalCloseButton color="white" />
          <ModalBody p={4} display="flex" justifyContent="center">
            <video width="100%" controls>
              <source src="/Presentacion_1.mp4" type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Box mt="auto" mb={4} textAlign={"center"} color={"brand.50"} zIndex={2}>
      <NextLink href="/hero2" passHref legacyBehavior>
          <ChakraLink fontSize="lg" color="brand.50" cursor="pointer" _hover={{ color: "white" }}>
            <HStack spacing={2} justify="center" flexDirection="column">
              <Heading size="sm">¿Cómo funciona MMS?</Heading>
              <Icon as={MdKeyboardDoubleArrowDown} boxSize={8} />
            </HStack>
          </ChakraLink>
        </NextLink>
        </Box>
    </Box>
  );
}
