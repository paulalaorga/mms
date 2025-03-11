"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  Box,
  Progress,
  Flex,
  Avatar
} from "@chakra-ui/react";
import Text from "@/components/ui/Text";
import { IUser } from "@/models/User";
import { IPurchasedProgram } from "@/models/Purchase"; // ✅ Importamos la interfaz, no el modelo
import UserLayout from "@/components/layout/UserLayout";
import ProfileProgress from "./profile/ProfileProgress";

export default function UserDashboard() {
  const { data: session, status} = useSession();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<IUser | null>(null);
  const [program, setProgram] = useState<IPurchasedProgram | null>(null);
  const [progress, setProgress] = useState<number>(0);
/*   const [therapistId, setTherapistId] = useState<string | null>(null);
  const [meetLink, setMeetLink] = useState<string | null>(null);
  const [whatsAppLink, setWhatsAppLink] = useState<string | null>(null);
 */
  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Error al cargar los datos del perfil.");
        const data: IUser = await res.json();
        setUserData(data);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    const fetchProgramData = async () => {
      try {
        const res = await fetch("/api/user/programs");
        if (!res.ok) throw new Error("Error al cargar los programas del usuario.");
        const data = await res.json();

        const purchasedProgram = data.purchasedPrograms.find((p: IPurchasedProgram) => p.userId === session.user.id);
        setProgram(purchasedProgram);

        if (purchasedProgram) {
          const startDate = new Date(purchasedProgram.purchaseDate);
          const endDate = new Date(startDate.getTime() + (365 * 24 * 60 * 60 * 1000)); // 365 días en milisegundos
          const now = new Date();

          const totalDays = endDate ? (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) : 0;
          const elapsedDays = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

          setProgress(totalDays > 0 ? (elapsedDays / totalDays) * 100 : 100);

/*           setTherapistId(purchasedProgram.therapistId || null);
          setMeetLink(purchasedProgram.meetLink || null);
          setWhatsAppLink(purchasedProgram.whatsAppLink || null);
 */        }
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchUserData();
    fetchProgramData();

  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
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

  return (
    <Container maxW="container.lg" p={4}>
      <VStack spacing={6} align="stretch">
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
        {/* Cabecera con avatar y bienvenida */}
        <Flex alignItems="center" mb={6}>
          <Avatar 
            size="lg" 
            bg="teal.500" 
            color="white"
            name={`${session.user.name || ""} ${session.user.surname || ""}`}
            mr={4}
          />
          <Box>
            <Text variant="heading" fontSize="4xl">
              Bienvenido, {session.user.name || "Usuario"} {session.user.surname || ""} 🎉
            </Text>
          </Box>
        </Flex>

        {/* Progreso del perfil */}
        <Box w="100%" mb={6}>
          <ProfileProgress />
        </Box>

        {/* Alerta si no está en ningún programa */}
        {userData && userData.isPatient !== undefined && !userData.isPatient && (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            No estás registrado en ningún programa. Consulta los programas disponibles en nuestra tienda.
          </Alert>
        )}

        {/* Información del programa actual */}
        {program && (
          <Box 
            w="100%" 
            p={6} 
            bg="white" 
            borderRadius="lg" 
            boxShadow="md" 
            border="1px"
            borderColor="gray.200"
          >
            <Text size="lg" textAlign="center" mb={6} color="teal.600">
              Tus Programas Actuales
            </Text>
            
            <Text size="md" color="teal.600" mb={2}>
              {program.programName}
            </Text>
            
            <Text fontSize="sm" mb={3} color="gray.600">
              {program.description}
            </Text>
            
            <Flex justifyContent="space-between" mb={4}>
              <Text fontSize="sm" color="gray.500">
                Inicio: {new Date(program.purchaseDate).toLocaleDateString()}
              </Text>
              
              {program.expiryDate && (
                <Text fontSize="sm" color="gray.500">
                  Fin: {new Date(program.expiryDate).toLocaleDateString()}
                </Text>
              )}
            </Flex>

            <Box w="100%" mt={4}>
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                Progreso en el programa:
              </Text>
              <Progress 
                value={progress} 
                colorScheme="teal" 
                size="lg" 
                borderRadius="md"
              />
              <Text textAlign="center" mt={2}>
                {progress.toFixed(2)}% completado
              </Text>
            </Box>
          </Box>
        )}
      </VStack>
    </Container>
  );
}

UserDashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <UserLayout>{page}</UserLayout>;
};