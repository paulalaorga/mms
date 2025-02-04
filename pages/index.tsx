"use client";

import { Box, Text, Container } from "@chakra-ui/react";
import Navbar from "../src/components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Container centerContent py={10}>
        <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="lg" w="100%" maxW="md">
          <Text fontSize="xl" fontWeight="bold">Bienvenido a Mi Aplicación</Text>
          <Text mt={4} color="gray.600">Usa el menú de navegación para acceder a las diferentes secciones.</Text>
        </Box>
      </Container>
    </>
  );
}
