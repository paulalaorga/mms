import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Icon,
  Progress,
  Alert,
  AlertIcon,
  Spinner,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import NextLink from "next/link";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verifiedPayment, setVerifiedPayment] = useState(false);

  // Obtener parámetros de la URL
  const order = searchParams.get("order");

  // Verificar el estado del pago
  useEffect(() => {
    const verifyPayment = async () => {
      if (!order) {
        setError("No se pudo identificar la información del pago");
        setLoading(false);
        return;
      }

      try {
        // Verificar el estado del pago con nuestra API
        const res = await fetch(`/api/paycomet/check-payment?order=${order}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Error al verificar el pago");
        }

        // Verificar si el pago fue exitoso
        if (data.payment?.state === 2 || data.payment?.stateName === "AUTHORIZED") {
          setVerifiedPayment(true);
          // Actualizar la sesión para reflejar el nuevo estado
          await update();
        } else {
          setError(`El estado del pago es: ${data.payment?.stateName || "Desconocido"}`);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      verifyPayment();
    } else {
      // Si no hay sesión, esperar a que se cargue
      const checkSession = setTimeout(() => {
        if (!session) {
          setError("No se pudo verificar la sesión de usuario");
          setLoading(false);
        }
      }, 3000);

      return () => clearTimeout(checkSession);
    }
  }, [order, session, update]);

  // Redirigir al usuario después de un tiempo
  useEffect(() => {
    if (verifiedPayment) {
      const redirectTimer = setTimeout(() => {
        router.push("/user/programs");
      }, 5000);

      return () => clearTimeout(redirectTimer);
    }
  }, [verifiedPayment, router]);

  return (
    <Container maxW="container.md" centerContent py={10}>
      <Box 
        textAlign="center" 
        p={8} 
        borderWidth={1} 
        borderRadius="lg" 
        boxShadow="lg" 
        bg="green.50"
        w="full"
      >
        {loading ? (
          <VStack spacing={4}>
            <Heading size="md">Verificando tu pago</Heading>
            <Spinner size="xl" color="green.500" />
            <Progress size="xs" isIndeterminate colorScheme="green" w="full" />
            <Text>Esto solo tomará unos momentos...</Text>
          </VStack>
        ) : error ? (
          <VStack spacing={4}>
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
            <Text>Hubo un problema al verificar tu pago.</Text>
            <Button as={NextLink} href="/user/programs" colorScheme="teal">
              Ver mis programas
            </Button>
          </VStack>
        ) : (
          <VStack spacing={6}>
            <Icon as={CheckCircleIcon} boxSize={16} color="green.500" />
            <Heading as="h1" size="xl" color="green.600">
              ¡Pago completado con éxito!
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Tu pago ha sido procesado correctamente.
            </Text>
            {order && (
              <Text fontSize="md" color="gray.500">
                Número de referencia: {order}
              </Text>
            )}
            <Text fontSize="md" color="gray.500" mt={2}>
              Serás redirigido a tus programas en unos segundos...
            </Text>
            <Progress 
              size="xs" 
              colorScheme="green" 
              w="full" 
              isIndeterminate 
            />
            <Button as={NextLink} href="/user/programs" colorScheme="teal" size="lg">
              Ver mis programas ahora
            </Button>
          </VStack>
        )}
      </Box>
    </Container>
  );
}