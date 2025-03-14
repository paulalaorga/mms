import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Spinner,
  Progress,
  Icon,
  Button,
  Divider,
  Badge,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";
import { FaCalendarAlt, FaUsers, FaArrowLeft, FaClock, FaUserClock } from "react-icons/fa";
import UserLayout from "@/components/layout/UserLayout";
import { IPurchasedProgram } from "@/models/Purchase";

export default function ProgramDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { status } = useSession();
  const toast = useToast();
  
  const [program, setProgram] = useState<IPurchasedProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [remainingDays, setRemainingDays] = useState(0);
  const [nextSession, setNextSession] = useState<string | null>(null);

  // Cargar detalles del programa
  useEffect(() => {
    // Redireccionar si no hay sesión
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status === "loading" || !id) return;

    const fetchProgramDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/programs/${id}`);
        
        if (!res.ok) {
          throw new Error("No se pudo cargar el programa");
        }
        
        const data = await res.json();
        setProgram(data);
        
        // Calcular progreso y días restantes
        if (data.purchaseDate && data.expiryDate) {
          const startDate = new Date(data.purchaseDate);
          const endDate = new Date(data.expiryDate);
          const now = new Date();
          
          const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
          const elapsedDays = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
          
          setRemainingDays(Math.max(0, totalDays - elapsedDays));
          setProgress(Math.min(100, (elapsedDays / totalDays) * 100));
        }
        
        // Simular próxima sesión (en un caso real obtendríamos esto de la API)
        const nextSessionDate = new Date();
        nextSessionDate.setDate(nextSessionDate.getDate() + 2);
        setNextSession(nextSessionDate.toLocaleDateString('es-ES', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          hour: '2-digit', 
          minute: '2-digit' 
        }));
      } catch (error) {
        console.error("Error al cargar programa:", error);
        setError(error instanceof Error ? error.message : "Error desconocido");
        
        toast({
          title: "Error al cargar programa",
          description: "No se pudo cargar la información del programa",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgramDetails();
  }, [id, status, router, toast]);

  // Redireccionar a la lista de programas
  const handleGoBack = () => {
    router.push("/user/programs");
  };

  // Unirse a sesión (esto sería una función más compleja en un escenario real)
  const handleJoinSession = () => {
    // Aquí se redireccionaría a la URL de Google Meet u otra plataforma
    toast({
      title: "Conectando a sesión",
      description: "Redirigiendo a la sala de sesión virtual...",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    
    // Simular redirección a Google Meet
    window.open("https://meet.google.com", "_blank");
  };

  if (loading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" thickness="4px" color="teal.500" />
        <Text mt={4}>Cargando detalles del programa...</Text>
      </Container>
    );
  }

  if (error || !program) {
    return (
      <Container centerContent py={10}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error || "No se encontró el programa solicitado"}
        </Alert>
        <Button 
          mt={6} 
          leftIcon={<FaArrowLeft />} 
          onClick={handleGoBack}
          colorScheme="teal"
        >
          Volver a mis programas
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Button 
        leftIcon={<FaArrowLeft />} 
        variant="outline" 
        mb={6} 
        onClick={handleGoBack}
      >
        Volver a mis programas
      </Button>
      
      <Box bg="white" borderRadius="lg" overflow="hidden" boxShadow="md" mb={8}>
        <Box 
          bg="teal.600" 
          color="white" 
          p={6}
          position="relative"
        >
          <Heading size="lg" mb={2}>
            {program.programName || "Programa"}
          </Heading>
          
          <Text fontSize="md" opacity={0.9}>
            {program.description || "Sin descripción disponible"}
          </Text>
          
          <HStack mt={4} spacing={4}>
            <Badge colorScheme="green" fontSize="sm" px={2} py={1} borderRadius="full">
              Activo
            </Badge>
            <Badge 
              colorScheme={program.groupLevel === "Fundamental" ? "blue" : "purple"} 
              fontSize="sm" 
              px={2} 
              py={1} 
              borderRadius="full"
            >
              {program.groupLevel || "Nivel no especificado"}
            </Badge>
          </HStack>
        </Box>
      
        <Box p={6}>
          <VStack spacing={6} align="stretch">
            {/* Progreso */}
            <Box>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="bold">Progreso del programa</Text>
                <Text>{progress.toFixed(0)}% completado</Text>
              </Flex>
              <Progress 
                value={progress} 
                colorScheme="teal" 
                borderRadius="full" 
                size="md"
                hasStripe
              />
              
              <Flex justify="space-between" mt={2}>
                <Text fontSize="sm" color="gray.600">
                  Inicio: {new Date(program.purchaseDate).toLocaleDateString()}
                </Text>
                {program.expiryDate && (
                  <Text fontSize="sm" color="gray.600">
                    Finaliza: {new Date(program.expiryDate).toLocaleDateString()}
                  </Text>
                )}
              </Flex>
              
              <HStack mt={3} color="teal.600">
                <Icon as={FaClock} />
                <Text>{remainingDays.toFixed(0)} días restantes</Text>
              </HStack>
            </Box>
            
            <Divider />
            
            {/* Próxima sesión */}
            <Box>
              <Heading size="md" mb={4} display="flex" alignItems="center">
                <Icon as={FaCalendarAlt} mr={2} />
                Próxima sesión
              </Heading>
              
              <Box 
                p={4} 
                borderWidth="1px" 
                borderRadius="md" 
                bg="teal.50"
              >
                <Flex 
                  direction={["column", "row"]} 
                  justify="space-between" 
                  align={["flex-start", "center"]}
                >
                  <Box mb={[4, 0]}>
                    <Text fontWeight="bold" fontSize="lg">
                      {nextSession || "No hay sesiones programadas"}
                    </Text>
                    <Flex align="center" color="gray.600" mt={1}>
                      <Icon as={FaUserClock} mr={2} />
                      <Text>Duración: 1 hora</Text>
                    </Flex>
                  </Box>
                  
                  <Button 
                    colorScheme="teal" 
                    leftIcon={<FaUsers />}
                    onClick={handleJoinSession}
                  >
                    Unirse a la sesión
                  </Button>
                </Flex>
              </Box>
            </Box>
            
            <Divider />
            
            {/* Recursos del programa */}
            <Box>
              <Heading size="md" mb={4}>
                Recursos del programa
              </Heading>
              
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                Los recursos del programa estarán disponibles después de tu primera sesión.
              </Alert>
            </Box>
          </VStack>
        </Box>
      </Box>
    </Container>
  );
}

// Aplicar layout de usuario
ProgramDetails.getLayout = function getLayout(page: React.ReactNode) {
  return <UserLayout>{page}</UserLayout>;
};