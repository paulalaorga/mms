"use client";

import { ReactNode } from "react";
import { Box, Flex, VStack, Link, Text, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { signOut } from "next-auth/react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Flex minH="100vh">
      {/* Menú Lateral */}
      <Box w="250px" bg="gray.800" color="white" p={5}>
        <VStack align="start" spacing={4}>
          <Text fontSize="xl" fontWeight="bold">Admin Panel</Text>
          <Link as={NextLink} href="/admin/profile" _hover={{ textDecoration: "underline" }}>
            Perfil
          </Link>
          <Link as={NextLink} href="/admin/content1" _hover={{ textDecoration: "underline" }}>
            Contenido 1
          </Link>
          <Link as={NextLink} href="/admin/content2" _hover={{ textDecoration: "underline" }}>
            Contenido 2
          </Link>

          {/* Botón para cerrar sesión */}
          <Button colorScheme="red" size="sm" w="100%" mt={4} onClick={() => signOut()}>
            Cerrar sesión
          </Button>
        </VStack>
      </Box>

      {/* Contenido Principal */}
      <Box flex="1" p={6}>
        {children}
      </Box>
    </Flex>
  );
};

export default AdminLayout;
