"use client";

import { ReactNode } from "react";
import { Box, Flex, VStack, Link, Button, Spinner } from "@chakra-ui/react";
import NextLink from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    } else if (session.user?.role !== "admin") {
      router.push("/user"); // Redirige a usuarios normales
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <Spinner />;
  }
  return (
    <Flex minH="100vh">
      {/* Menú Lateral */}
      <Box w="250px" bg="gray.800" color="white" p={5}>
        <VStack align="start" spacing={4}>
          <Link fontSize="xl" fontWeight="bold" href="/admin">Admin Panel</Link>
          <Link as={NextLink} href="/admin/profile" _hover={{ textDecoration: "underline" }}>
            Perfil
          </Link>
          <Link as={NextLink} href="/admin/users" _hover={{ textDecoration: "underline" }}>
            Usuarios
          </Link>
          <Link as={NextLink} href="/admin/content2" _hover={{ textDecoration: "underline" }}>
            Contenido 2
          </Link>
          <Link as={NextLink} href="/admin/content2" _hover={{ textDecoration: "underline" }}>
            Contenido 2
          </Link>
          <Link as={NextLink} href="/admin/content2" _hover={{ textDecoration: "underline" }}>
            Contenido 2
          </Link><Link as={NextLink} href="/admin/content2" _hover={{ textDecoration: "underline" }}>
            Contenido 2
          </Link><Link as={NextLink} href="/admin/content2" _hover={{ textDecoration: "underline" }}>
            Contenido 2
          </Link><Link as={NextLink} href="/admin/content2" _hover={{ textDecoration: "underline" }}>
            Contenido 2
          </Link><Link as={NextLink} href="/admin/content2" _hover={{ textDecoration: "underline" }}>
            Contenido 2
          </Link><Link as={NextLink} href="/admin/content2" _hover={{ textDecoration: "underline" }}>
            Contenido 2
          </Link><Link as={NextLink} href="/admin/content2" _hover={{ textDecoration: "underline" }}>
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
