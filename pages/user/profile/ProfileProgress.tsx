"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Container,
  Alert,
  Progress,
  AlertIcon,
  Box,
  Link as ChakraLink,
} from "@chakra-ui/react";
import NextLink from "next/link";

export default function ProfileProgress() {
  const { data: session } = useSession();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Error al cargar los datos del perfil.");

        const data = await res.json();
        console.log("✅ Datos del usuario recibidos:", data);

        const user = data.userData || data;

        const totalFields = 7; // Número total de campos requeridos
        let filledFields = 0;
        const missing: string[] = [];

        if (!user.name) missing.push("Nombre");
        else filledFields++;
        if (!user.surname) missing.push("Apellido");
        else filledFields++;
        if (!user.email) missing.push("Email");
        else filledFields++;
        if (!user.dni) missing.push("DNI");
        else filledFields++;
        if (!user.phone) missing.push("Teléfono");
        else filledFields++;
        if (!user.contractSigned) missing.push("Contrato firmado");
        else filledFields++;
        if (!user.recoveryContact) missing.push("Contacto de recuperación");
        else filledFields++;

        setMissingFields(missing);
        setCompletionPercentage((filledFields / totalFields) * 100);
      } catch (error) {
        console.error("Error al cargar los datos del perfil:", error);
      }
    };

    fetchUserData();
  }, [session]);
  if (completionPercentage === 100) return null;

  return (
    <Container centerContent>
      {completionPercentage < 100 && (
        <Box w="100%" textAlign="center">
          <Alert status="warning" mt={4}>
            <AlertIcon />
            Tu perfil está incompleto, faltan los siguientes datos:{" "}{missingFields.join(", ")}
          </Alert>
          <Progress mt={2} colorScheme="orange" value={completionPercentage} />
          <NextLink href="/user/profile" passHref>
            <ChakraLink mt={2} color="blue.500" fontWeight="bold">
              Completa tu perfil
            </ChakraLink>
          </NextLink>
        </Box>
      )}
    </Container>
  );
}
