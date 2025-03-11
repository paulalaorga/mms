"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Progress,
  Box,
  Flex,
  Icon,
  Button,
  Badge,
  useColorModeValue
} from "@chakra-ui/react";

import { FaExclamationTriangle, FaUser } from "react-icons/fa";
import NextLink from "next/link";
import Text from "@/components/ui/Text";

export default function ProfileProgress() {
  const { data: session, status } = useSession();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const boxBg = useColorModeValue("white", "gray.800");
  const progressTrackBg = useColorModeValue("gray.100", "gray.700");
  const progressFilledBg = useColorModeValue("teal.500", "teal.300");
  const progressTextColor = useColorModeValue("gray.600", "gray.300");
  const badgeColor = useColorModeValue("orange.500", "orange.300");

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Error desconocido");
        }

        const data = await res.json();
        console.log("✅ Datos del usuario recibidos:", data);

        // Verificar si `userData` existe
        if (!data || !data.userData) {
          throw new Error("❌ userData no existe en la respuesta de la API.");
        }

        // Asegurar que userData está definido
        const userData = data.userData;
        if (!userData) throw new Error("No se encontraron datos del usuario.");

        const totalFields = 7;
        let filledFields = 0;
        const missing: string[] = [];

        if (!userData.name) missing.push("Nombre");
        else filledFields++;
        if (!userData.surname) missing.push("Apellido");
        else filledFields++;
        if (!userData.email) missing.push("Email");
        else filledFields++;
        if (!userData.dni) missing.push("DNI");
        else filledFields++;
        if (!userData.phone) missing.push("Teléfono");
        else filledFields++;
        if (!userData.contractSigned) missing.push("Contrato firmado");
        else filledFields++;
        if (!userData.recoveryContact) missing.push("Contacto de recuperación");
        else filledFields++;

        setMissingFields(missing);
        setCompletionPercentage((filledFields / totalFields) * 100);
      } catch (error) {
        console.error("Error al cargar los datos del perfil:", error);
      }
    };

    fetchUserData();
  }, [session]);

  // Si aún está cargando, evitar renderizar datos incompletos
  if (status === "loading") return <p>Cargando perfil...</p>;

  // Si no hay sesión, manejar el estado de error
  if (!session || !session.user) return <p>Error al cargar perfil</p>;

  // 🔹 Ocultar la barra si el perfil está completo
  if (completionPercentage === 100) return null;

  return (
    <Box w="100%" maxW="800px" mx="auto" mb={6}>
      {completionPercentage < 100 && (
        <Box 
          bg={boxBg} 
          borderRadius="lg" 
          p={4} 
          boxShadow="md"
          border="1px" 
          borderColor="gray.200"
        >
          {/* Encabezado */}
          <Flex align="space-evenly" mb={3}>
            <Icon 
              as={FaExclamationTriangle} 
              color="orange.500" 
              boxSize={5} 
              mr={2} 
            />
            <Text fontWeight="bold" fontSize="lg">
              Perfil incompleto
            </Text>
            <Badge 
              ml="auto" 
              bg={badgeColor} 
              colorScheme="orange"
              borderRadius="full" 
              px={2}
              alignContent="center"
            >
              {completionPercentage.toFixed(0)}% completado
            </Badge>
          </Flex>
          
          {/* Barra de progreso */}
          <Box mb={4}>
            <Progress 
              value={completionPercentage} 
              size="md" 
              borderRadius="full" 
              colorScheme="teal"
              bg={progressTrackBg}
              sx={{
                "& > div": {
                  background: progressFilledBg,
                  transition: "width 0.5s ease-in-out"
                }
              }}
            />
            <Flex justify="space-between" mt={1}>
              <Text fontSize="xs" color={progressTextColor}>0%</Text>
              <Text fontSize="xs" color={progressTextColor}>100%</Text>
            </Flex>
          </Box>
          
          {/* Campos faltantes */}
          <Box mb={4}>
            <Text fontSize="sm" mb={2}>
              Te faltan {missingFields.length} campos por completar:
            </Text>
            <Flex flexWrap="wrap" gap={2}>
              {missingFields.map(field => (
                <Badge 
                  key={field} 
                  py={1} 
                  px={2} 
                  borderRadius="md" 
                  colorScheme="red"
                  variant="subtle"
                >
                  {field}
                </Badge>
              ))}
            </Flex>
          </Box>
          
          {/* Botón de acción */}
          <Button
            as={NextLink}
            href="/user/profile"
            colorScheme="teal"
            leftIcon={<FaUser />}
            size="md"
            w="full"
            mt={2}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            transition="all 0.2s"
          >
            Completar mi perfil
          </Button>
        </Box>
      )}
    </Box>
  );
}
