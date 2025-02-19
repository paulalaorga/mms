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

export default function ProfileProgress() {
  const { data: session, status } = useSession();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);

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
    <Container centerContent>
      {completionPercentage < 100 && (
        <Box w="100%" textAlign="center">
          <Alert status="warning" mt={4}>
            <AlertIcon />
            Tu perfil está incompleto, faltan los siguientes datos:{" "}
            {missingFields.join(", ")}
          </Alert>
          <Progress mt={2} colorScheme="orange" value={completionPercentage} />
          <ChakraLink
            href="/user/profile"
            mt={2}
            color="blue.500"
            fontWeight="bold"
          >
            Completa tu perfil
          </ChakraLink>
        </Box>
      )}
    </Container>
  );
}
