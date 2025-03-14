// pages/admin/subscriptions/[id].tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Heading,
  Box,
  Text,
  Spinner,
  Badge,
  Button,
  Alert,
  AlertIcon,
  Stack,
  Divider,
} from "@chakra-ui/react";

interface SubscriptionData {
  _id: string;
  userId: string;
  programId: string;
  programType: string;
  programName: string;
  orderId: string;
  amount: number;
  status: string;
  startDate: string;
  endDate?: string;
  paymentFrequency: string;
  duration: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userDetails?: {
    name: string;
    email: string;
  };
}

export default function SubscriptionDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchSubscription = async () => {
      try {
        const res = await fetch(`/api/admin/subscriptions/${id}`);
        
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        
        const data = await res.json();
        setSubscription(data);
      } catch (err) {
        console.error("Error fetching subscription:", err);
        setError("No se pudo cargar la información de la suscripción");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [id]);

  if (loading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Cargando información de la suscripción...</Text>
      </Container>
    );
  }

  if (error || !subscription) {
    return (
      <Container centerContent py={10}>
        <Alert status="error">
          <AlertIcon />
          {error || "No se encontró la suscripción"}
        </Alert>
        <Button mt={4} onClick={() => router.push("/admin/subscriptions")}>
          Volver a Suscripciones
        </Button>
      </Container>
    );
  }

  // Función para determinar el color del status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "paid":
      case "authorized":
        return "green";
      case "pending":
        return "yellow";
      case "failed":
      case "canceled":
      case "expired":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <Box mb={6}>
        <Button size="sm" onClick={() => router.push("/admin/subscriptions")}>
          ← Volver a la lista
        </Button>
      </Box>

      <Heading size="lg" mb={6}>
        Detalles de Suscripción
      </Heading>

      <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
        <Stack spacing={4}>
          <Box>
            <Heading size="md" mb={2}>
              {subscription.programName}
            </Heading>
            <Badge colorScheme={getStatusColor(subscription.status)}>
              {subscription.status}
            </Badge>
            {' '}
            <Badge colorScheme={subscription.isActive ? "green" : "red"}>
              {subscription.isActive ? "Activo" : "Inactivo"}
            </Badge>
          </Box>

          <Divider />

          <Box>
            <Text fontWeight="bold">Usuario</Text>
            {subscription.userDetails ? (
              <>
                <Text>{subscription.userDetails.name}</Text>
                <Text>{subscription.userDetails.email}</Text>
              </>
            ) : (
              <Text>ID: {subscription.userId}</Text>
            )}
          </Box>

          <Box>
            <Text fontWeight="bold">Detalles del Programa</Text>
            <Text>Tipo: {subscription.programType}</Text>
            <Text>ID del Programa: {subscription.programId}</Text>
          </Box>

          <Box>
            <Text fontWeight="bold">Detalles del Pago</Text>
            <Text>Importe: {subscription.amount}€</Text>
            <Text>Frecuencia: {subscription.paymentFrequency}</Text>
            <Text>Duración: {subscription.duration} {subscription.paymentFrequency === "monthly" ? "meses" : "pagos"}</Text>
            <Text>Orden ID: {subscription.orderId}</Text>
          </Box>

          <Box>
            <Text fontWeight="bold">Fechas</Text>
            <Text>Inicio: {new Date(subscription.startDate).toLocaleDateString()}</Text>
            {subscription.endDate && (
              <Text>Fin: {new Date(subscription.endDate).toLocaleDateString()}</Text>
            )}
            <Text>Creada: {new Date(subscription.createdAt).toLocaleString()}</Text>
            <Text>Última Actualización: {new Date(subscription.updatedAt).toLocaleString()}</Text>
          </Box>

          <Divider />

          <Box>
            <Button 
              colorScheme="blue" 
              mr={3}
              onClick={() => router.push(`/admin/users/${subscription.userId}`)}
            >
              Ver Usuario
            </Button>
            <Button 
              colorScheme={subscription.isActive ? "red" : "green"}
              onClick={() => console.log(`Toggle active status for ${subscription._id}`)}
            >
              {subscription.isActive ? "Desactivar" : "Activar"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}