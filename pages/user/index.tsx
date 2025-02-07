"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import UserLayout from "./layout";

interface Product {
  id: string;
  name: string;
  price: number;
  status: string;
}

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProfileProgress, setShowProfileProgress] = useState(true);
  const [isPatient, setIsPatient] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) return;
  
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Error al cargar los datos del perfil.");
  
        const data = await res.json();
        console.log("✅ Datos del usuario recibidos:", data);
  
        const userData = data.userData || data;
  
        setIsPatient(userData.isPatient ?? false);
        setShowProfileProgress(
          !userData.name ||
          !userData.surname ||
          !userData.email ||
          !userData.dni ||
          !userData.phone ||
          !userData.contractSigned ||
          !userData.recoveryContact
        );
  
      } catch (error) {
        console.error("Error al cargar los datos del perfil:", error);
      }
    };
  
    fetchUserData();
  }, [session]);
  

  if (status === "loading") {
    return <Spinner size="xl" />;
  }

  return (
    <Container centerContent py={10}>
      <VStack spacing={6} align="center">
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
        <Heading size="lg">
          Bienvenido, {session?.user?.name || "Usuario"}{" "}
          {session?.user?.surname || ""} 🎉
        </Heading>
        <Text fontSize="lg">Este es tu panel de usuario</Text>
        {/* Mostrar barra de progreso solo si faltan datos */}
        {showProfileProgress && (
          <Box w="100%" alignContent="center" textAlign="center">
            <ProfileProgress />
          </Box>
        )}
        {!isPatient && (
          <Alert status="info" mt={4}>
            <AlertIcon />
            No estás registrado en ningún programa. Consulta los programas
            disponibles en nuestra tienda.
          </Alert>
        )}
        {isPatient && session?.user?.groupProgramPaid && (
          <Alert status="success" mt={4}>
            <AlertIcon />
            Tienes acceso a sesiones grupales. Revisa tu calendario para unirte.
          </Alert>
        )}
        {isPatient &&
          session?.user?.individualProgram &&
          session?.user?.nextSessionDate && (
            <Alert status="info" mt={4}>
              <AlertIcon />
              Tu próxima sesión individual es el{" "}
              {new Date(session.user.nextSessionDate).toLocaleDateString()}.
            </Alert>
          )}
      </VStack>
    </Container>
  );
}

UserDashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <UserLayout>{page}</UserLayout>;
};