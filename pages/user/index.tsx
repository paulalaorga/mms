"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { IUser } from "@/models/User";
import UserLayout from "../../src/components/layout/UserLayout";
import ProfileProgress from "./profile/ProfileProgress";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<IUser | null>(null);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Error al cargar los datos del perfil.");

        const data: IUser = await res.json();
        console.log("✅ Datos del usuario recibidos:", data);
        setUserData(data);
      } catch (error) {
        console.error("Error al cargar los datos del perfil:", error);
        setError("Error al cargar los datos del perfil.");
      }
    };

    fetchUserData();
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("🔴 No autenticado, redirigiendo a /login");
      router.push("/login"); // Redirigir a la página de login
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <Container centerContent>
        <Spinner size="xl" />
      </Container>
    );
  }

  if (!session?.user) {
    return (
      <Container centerContent py={10}>
        <Alert status="error">
          <AlertIcon />
          No se pudo cargar la sesión de usuario.
        </Alert>
      </Container>
    );
  }
  console.log("🔍 Estado de sesión:", status, "Datos de sesión:", session);


  return (
    <Container centerContent py={10}>
      <VStack spacing={6} align="center">
        <Heading size="lg">
          Bienvenido, {session.user.name || "Usuario"} {userData?.surname || ""}{" "}
          🎉
        </Heading>
        <Text fontSize="lg">Este es tu panel de usuario</Text>

        {/* Mostrar barra de progreso solo si faltan datos */}
        <Box w="100%" alignContent="center" textAlign="center">
          <ProfileProgress />
        </Box>

        {/* Si el usuario NO es paciente, mostrar programas disponibles */}
        {!userData?.isPatient && (
          <Alert status="info" mt={4}>
            <AlertIcon />
            No estás registrado en ningún programa. Consulta los programas
            disponibles en nuestra tienda.
          </Alert>
        )}

        {/* Mostrar alerta si el usuario tiene acceso a sesiones grupales */}
        {userData?.isPatient && userData?.groupProgramPaid && (
          <Alert status="success" mt={4}>
            <AlertIcon />
            Tienes acceso a sesiones grupales. Revisa tu calendario para unirte.
          </Alert>
        )}

        {/* Mostrar alerta de próxima sesión individual */}
        {userData?.individualProgram && userData?.nextSessionDate && (
          <Alert status="info" mt={4}>
            <AlertIcon />
            Tu próxima sesión individual es el{" "}
            {new Date(userData.nextSessionDate).toLocaleDateString()}.
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
