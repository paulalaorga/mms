"use client";

import { Box, Flex, HStack, Link, Text, Container } from "@chakra-ui/react";
import { VscAccount } from "react-icons/vsc"; // Importa el icono de usuario
import NextLink from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Barra de navegación */}
      <Box bg="gray.800" color="white" py={3} px={6}>
        <Flex justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="bold">Mi Aplicación</Text>
          <HStack spacing={6}>
            <Link as={NextLink} href="/content1" _hover={{ textDecoration: "underline" }}>
              Contenido 1
            </Link>
            <Link as={NextLink} href="/content2" _hover={{ textDecoration: "underline" }}>
              Contenido 2
            </Link>
            <Link as={NextLink} href="/login" _hover={{ textDecoration: "underline" }}>
              <VscAccount fontSize="2rem"/> {/* Reemplaza "Login" por el icono */}
            </Link>
          </HStack>
        </Flex>
      </Box>

     {/* Contenido de la home */}
     <Container centerContent py={10}>
        <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="lg" w="100%" maxW="md">
          <Text fontSize="xl" fontWeight="bold">Bienvenido a Mi Aplicación</Text>
          <Text mt={4} color="gray.600">Usa el menú de navegación para acceder a las diferentes secciones.</Text>
        </Box>
      </Container>
    </>
  );
}
