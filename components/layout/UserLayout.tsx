"use client";

import { ReactNode, useState } from "react";
import { Box, Flex, VStack, Link, Button, Icon } from "@chakra-ui/react";
import Text from "../ui/Text";
import { signOut } from "next-auth/react";
import NextLink from "next/link";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { FaHome, FaUser, FaCalendarAlt, FaBookOpen, FaMoneyBill, FaSignOutAlt } from "react-icons/fa";

const UserLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const isPatient = session?.user?.isPatient;

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
  }, [session, status, router]);

  // Determinar la página activa
  const isActivePath = (path: string) => {
    return pathname?.startsWith(path);
  };

  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  return (
    <Flex minH="100vh">
      {/* Menú Lateral Dinámico */}
      <Box 
        position="fixed"
        top="0"
        left="0"
        h="100vh"
        bg="linear-gradient(to bottom, var(--chakra-colors-teal-700), var(--chakra-colors-teal-900))"
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
          borderColor="teal.600"
          bg={isActivePath('/user') && !isActivePath('/user/profile') && !isActivePath('/user/sessions') && !isActivePath('/user/programs') ? "teal.800" : "transparent"} 
          display="flex" 
          alignItems="center"
          h="60px"
          _hover={{ bg: "teal.800" }}
          borderRadius="md"
          transition="background 0.2s"
        >
          <Icon as={FaHome} w={6} h={6} color="teal.200" />
          {isExpanded && (
            <Link
              as={NextLink}
              href="/user"
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
                Inicio
              </Text>
            </Link>
          )}
        </Box>

        <VStack align="start" spacing={2} width="100%">
          
          <Link
            as={NextLink}
            href="/user/profile"
            display="flex"
            alignItems="center"
            w="full"
            p={3}
            borderRadius="md"
            bg={isActivePath('/user/profile') ? "teal.800" : "transparent"}
            _hover={{ bg: "teal.800" }}
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
                Datos de Perfil
              </Text>
            )}
          </Link>
          
          <Link
            as={NextLink}
            href="/user/sessions"
            display="flex"
            alignItems="center"
            w="full"
            p={3}
            borderRadius="md"
            bg={isActivePath('/user/sessions') ? "teal.800" : "transparent"}
            _hover={{ bg: "teal.800" }}
            transition="background 0.2s"
          >
            <Icon as={FaCalendarAlt} w={5} h={5} />
            {isExpanded && (
              <Text 
                ml={3} 
                transition="opacity 0.3s"
                opacity={isExpanded ? 1 : 0}
                variant="bold"
              >
                Mis Sesiones
              </Text>
            )}
          </Link>
          
          <Link
            as={NextLink}
            href="/user/programs"
            display="flex"
            alignItems="center"
            w="full"
            p={3}
            borderRadius="md"
            bg={isActivePath('/user/programs') ? "teal.800" : "transparent"}
            _hover={{ bg: "teal.800" }}
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

          {isPatient && (
          <Link
            as={NextLink}
            href="/user/programs"
            display="flex"
            alignItems="center"
            w="full"
            p={3}
            borderRadius="md"
            bg={isActivePath('/user/programs') ? "teal.800" : "transparent"}
            _hover={{ bg: "teal.800" }}
            transition="background 0.2s"
          >
            <Icon as={FaMoneyBill} w={5} h={5} />
            {isExpanded && (
              <Text 
                ml={3} 
                transition="opacity 0.3s"
                opacity={isExpanded ? 1 : 0}
              >
                Mis Pagos
              </Text>
            )}
          </Link>
          )}


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

export default UserLayout;