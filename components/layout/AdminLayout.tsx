"use client";

import { ReactNode } from "react";
import { Box, Flex, VStack, Link, Icon, Button, Spinner } from "@chakra-ui/react";
import Text from "../ui/Text";
import NextLink from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHome, FaUser, FaCreditCard, FaBookOpen, FaEnvelope, FaChartBar, FaSignOutAlt } from "react-icons/fa";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    } else if (session.user?.role !== "admin") {
      router.push("/user"); // Redirige a usuarios normales
    }
  }, [session, status, router]);

  const isActivePath = (path: string) => {
    return pathname?.startsWith(path);
  };

  if (status === "loading") {
    return <Spinner />;
  }
  return (
    <Flex minH="100vh">
      {/* Menú Lateral Dinámico */}
      <Box 
        position="fixed"
        top="0"
        left="0"
        h="100vh"
        bg="linear-gradient(to bottom, var(--chakra-colors-gray-800), var(--chakra-colors-gray-900))"
        color="white"
        boxShadow="xl"
        transition="width 0.3s ease"
        w={isExpanded ? "200px" : "70px"}
        zIndex={30}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        p={3}
      >
        {/* Logo / Título */}
        <Box 
          p={2} 
          mb={6} 
          borderBottom="1px" 
          borderColor="gray.600"
          bg={isActivePath('/admin') && !isActivePath('/admin/users') && !isActivePath('/admin/payment-status') && !isActivePath('/admin/programs') && !isActivePath('/admin/emails') && !isActivePath('/admin/reportes') ? "gray.700" : "transparent"} 
          display="flex" 
          alignItems="center"
          h="60px"
          _hover={{ bg: "gray.700" }}
          borderRadius="md"
          transition="background 0.2s"
        >
          <Icon as={FaHome} w={6} h={6} color="blue.200" />
          {isExpanded && (
            <Link
              as={NextLink}
              href="/admin"
              display="flex"
              alignItems="center"
              w="full"
              p={3}
              borderRadius="md"
              transition="background 0.2s"
              _hover={{ textDecoration: "none" }}
            >
              <Text 
                ml={3} 
                transition="opacity 0.3s"
                opacity={isExpanded ? 1 : 0}
                variant="bold"
              >
                Panel Admin
              </Text>
            </Link>
          )}
        </Box>

        <VStack align="start" spacing={2} width="100%">
          <Link
            as={NextLink}
            href="/admin/users"
            display="flex"
            alignItems="center"
            w="full"
            p={3}
            borderRadius="md"
            bg={isActivePath('/admin/users') ? "gray.700" : "transparent"}
            _hover={{ bg: "gray.700" }}
            transition="background 0.2s"
          >
            <Icon as={FaUser} w={5} h={5} />
            {isExpanded && (
              <Text 
                ml={3} 
                transition="opacity 0.3s"
                opacity={isExpanded ? 1 : 0}
                variant="bold"
              >
                Usuarios
              </Text>
            )}
          </Link>
          
          <Link
            as={NextLink}
            href="/admin/payment-status"
            display="flex"
            alignItems="center"
            w="full"
            p={3}
            borderRadius="md"
            bg={isActivePath('/admin/payment-status') ? "gray.700" : "transparent"}
            _hover={{ bg: "gray.700" }}
            transition="background 0.2s"
          >
            <Icon as={FaCreditCard} w={5} h={5} />
            {isExpanded && (
              <Text 
                ml={3} 
                transition="opacity 0.3s"
                opacity={isExpanded ? 1 : 0}
                variant="bold"
              >
                Facturación
              </Text>
            )}
          </Link>
          
          <Link
            as={NextLink}
            href="/admin/programs"
            display="flex"
            alignItems="center"
            w="full"
            p={3}
            borderRadius="md"
            bg={isActivePath('/admin/programs') ? "gray.700" : "transparent"}
            _hover={{ bg: "gray.700" }}
            transition="background 0.2s"
          >
            <Icon as={FaBookOpen} w={5} h={5} />
            {isExpanded && (
              <Text 
                ml={3} 
                transition="opacity 0.3s"
                opacity={isExpanded ? 1 : 0}
                variant="bold"
              >
                Programas
              </Text>
            )}
          </Link>
          
          <Link
            as={NextLink}
            href="/admin/emails"
            display="flex"
            alignItems="center"
            w="full"
            p={3}
            borderRadius="md"
            bg={isActivePath('/admin/emails') ? "gray.700" : "transparent"}
            _hover={{ bg: "gray.700" }}
            transition="background 0.2s"
          >
            <Icon as={FaEnvelope} w={5} h={5} />
            {isExpanded && (
              <Text 
                ml={3} 
                transition="opacity 0.3s"
                opacity={isExpanded ? 1 : 0}
                variant="bold"
              >
                Emails
              </Text>
            )}
          </Link>
          
          <Link
            as={NextLink}
            href="/admin/reportes"
            display="flex"
            alignItems="center"
            w="full"
            p={3}
            borderRadius="md"
            bg={isActivePath('/admin/reportes') ? "gray.700" : "transparent"}
            _hover={{ bg: "gray.700" }}
            transition="background 0.2s"
          >
            <Icon as={FaChartBar} w={5} h={5} />
            {isExpanded && (
              <Text 
                ml={3} 
                transition="opacity 0.3s"
                opacity={isExpanded ? 1 : 0}
                variant="bold"
              >
                Reportes
              </Text>
            )}
          </Link>

          {/* Botón para cerrar sesión - Posicionado en la parte inferior */}
          <Box position="absolute" bottom="20px" left="0" width="100%" p={3}>
            <Button 
              colorScheme="red" 
              size="sm" 
              w="full" 
              leftIcon={<FaSignOutAlt />}
              onClick={() => signOut()}
              justifyContent={isExpanded ? "flex-start" : "center"}
            >
              {isExpanded && "Cerrar sesión"}
            </Button>
          </Box>
        </VStack>
      </Box>

      {/* Contenido Principal - Se ajusta automáticamente cuando cambia el tamaño de la barra */}
      <Box 
        flex="1" 
        p={6} 
        ml={isExpanded ? "250px" : "70px"}
        transition="margin-left 0.3s ease"
      >
        {children}
      </Box>
    </Flex>
  );
};

export default AdminLayout;