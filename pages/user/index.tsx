"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  Container,
  Heading,
  Text,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  Box,
} from "@chakra-ui/react";
import IUser from "@/models/User";
import UserLayout from "./layout";
import ProfileProgress from "./profile/ProfileProgress";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [error, setError] = useState("");
  const [isPatient, setIsPatient] = useState(false);


  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Error al cargar los datos del perfil.");

        const data: typeof IUser = await res.json();
        console.log("✅ Datos del usuario recibidos:", data);

        // ✅ Verifica si el usuario es paciente y actualiza el estado
        setIsPatient(data.isPatient ?? false);

      } catch (error) {
        console.error("Error al cargar los datos del perfil:", error);
      }
    };

    setIsPatient(session.user.isPatient || false);
    fetchUserData();
  }, [session]); // ✅ Dependencia correcta

  if (status === "loading") {
    return (
      <Container centerContent>
        <Spinner size="xl" />
      </Container>
    );
  }

  if (!session?.user) {
    setError("No se pudo cargar la sesión de usuario");
  }

  return (
    <Container centerContent py={10}>
      <VStack spacing={6} align="center">
        <Heading size="lg">
          Bienvenido, {session?.user?.name || "Usuario"}{" "}
          {session?.user?.surname || ""} 🎉
        </Heading>
        <Text fontSize="lg">Este es tu panel de usuario</Text>

        {/* Mostrar barra de progreso solo si faltan datos */}
          <Box w="100%" alignContent="center" textAlign="center">
            <ProfileProgress />
          </Box>

        {/* Si el usuario NO es paciente, mostrar programas disponibles */}
        {!isPatient && (
          <Alert status="info" mt={4}>
            <AlertIcon />
            No estás registrado en ningún programa. Consulta los programas
            disponibles en nuestra tienda.
          </Alert>
        )}

        {/* Mostrar alerta si el usuario tiene acceso a sesiones grupales */}
        {session?.user?.isPatient && session?.user?.groupProgramPaid && (
          <Alert status="success" mt={4}>
            <AlertIcon />
            Tienes acceso a sesiones grupales. Revisa tu calendario para unirte.
          </Alert>
        )}

        {/* Mostrar alerta de próxima sesión individual */}
        {session?.user?.individualProgram && session?.user?.nextSessionDate && (
          <Alert status="info" mt={4}>
            <AlertIcon />
            Tu próxima sesión individual es el{" "}
            {new Date(session.user.nextSessionDate).toLocaleDateString()}.
          </Alert>
        )}

        {error && (
          <Alert status="error" mt={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}
      </VStack>
    </Container>
  );
}

// Layout para la página de usuario
UserDashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <UserLayout>{page}</UserLayout>;
};
