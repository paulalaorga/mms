import { 
  Box, Button, Flex, HStack, Link, IconButton, Drawer, DrawerOverlay, 
  DrawerContent, DrawerCloseButton, DrawerBody, VStack, useDisclosure, useBreakpointValue 
} from "@chakra-ui/react";
import { VscAccount } from "react-icons/vsc";
import { FiMenu } from "react-icons/fi"; // Icono de menú hamburguesa
import NextLink from "next/link";
import Image from "next/image";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: true });

  return (
    <Box bg="brand.200" color="white" py={3} px={6} zIndex={100} position="sticky" top={0}>
      <Flex justify="space-between" align="center">
        {/* Logo */}
        <Link as={NextLink} href="/">
          <Image src="/muchomejorsin.svg" alt="Logo" width={80} height={80} />
        </Link>

        {/* Menú para pantallas grandes */}
        {!isMobile && (
          <HStack spacing={6}>
            <Link as={NextLink} href="/familia" _hover={{ color: "black" }} fontWeight="600" textTransform="uppercase">
              Familia
            </Link>
            <Link as={NextLink} href="/programas" _hover={{ color: "black" }} fontWeight="600" textTransform="uppercase">
              Programas
            </Link>
            <Link as={NextLink} href="/equipo" _hover={{ color: "black" }} fontWeight="600" textTransform="uppercase">
              El Equipo
            </Link>
            <Link as={NextLink} href="/noticias" _hover={{ color: "black" }} fontWeight="600" textTransform="uppercase">
              Noticias
            </Link>
            <Button
              as={Link} href="/register"
              colorScheme="white" borderColor="black" bg="black.200"
              variant="outline" rounded="full"
              _hover={{ transform: "scale(1.1)", textDecoration: "none" }}
              textTransform="uppercase"
            >
              Matricúlate ahora
            </Button>
            <Link as={NextLink} href="/login" _hover={{ color: "black", transform: "scale(1.1)" }}>
              <VscAccount fontSize="2rem" />
            </Link>
          </HStack>
        )}

        {/* Menú hamburguesa en móviles */}
        {isMobile && (
          <IconButton
            icon={<FiMenu />}
            fontSize="5xl"
            variant="ghost"
            color="white"
            onClick={onOpen}
            aria-label="Abrir menú"
          />
        )}
      </Flex>

      {/* Drawer para menú en móviles */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="brand.200" color="white">
          <DrawerCloseButton />
          <DrawerBody>
            <VStack spacing={6} mt={10} align="start">
              <Link as={NextLink} href="/familia" onClick={onClose} _hover={{ color: "black" }} fontWeight="600" textTransform="uppercase">
                Familia
              </Link>
              <Link as={NextLink} href="/programas" onClick={onClose} _hover={{ color: "black" }} fontWeight="600" textTransform="uppercase">
                Programas
              </Link>
              <Link as={NextLink} href="/equipo" onClick={onClose} _hover={{ color: "black" }} fontWeight="600" textTransform="uppercase">
                El Equipo
              </Link>
              <Link as={NextLink} href="/noticias" onClick={onClose} _hover={{ color: "black" }} fontWeight="600" textTransform="uppercase">
                Noticias
              </Link>
              <Button
                as={Link} href="/register"
                colorScheme="white" borderColor="black" bg="black.200"
                variant="outline" rounded="full"
                _hover={{ transform: "scale(1.1)", textDecoration: "none" }}
                textTransform="uppercase"
                w="full"
                onClick={onClose}
              >
                Matricúlate ahora
              </Button>
              <Link as={NextLink} href="/login" onClick={onClose} _hover={{ color: "black", transform: "scale(1.1)" }}>
                <VscAccount fontSize="2rem" />
              </Link>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
