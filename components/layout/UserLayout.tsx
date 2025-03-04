"use client";

import { ReactNode } from "react";
import { Box, Flex, VStack, Link, Button } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import NextLink from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const UserLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
  }, [session, status, router]);

  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  return (
    <Flex minH="100vh">
      {/* Menú Lateral */}
      <Box w="250px" bg="gray.800" color="white" p={5}>
        <VStack align="start" spacing={4}>
          <Link as={NextLink} href="/user"fontSize="xl" fontWeight="bold">Panel de Usuario</Link>
          <Link as={NextLink} href="/user/profile" _hover={{ textDecoration: "underline" }}>
            Perfil
          </Link>
          <Link as={NextLink} href="/user/sessions" _hover={{ textDecoration: "underline" }}>
            Mis Sesiones
          </Link>
          <Link as={NextLink} href="/user/programs" _hover={{ textDecoration: "underline" }}>
            Programas
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

export default UserLayout;
