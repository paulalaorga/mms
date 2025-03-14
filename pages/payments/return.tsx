import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import {
  Flex,
  Heading,
  Text,
  Spinner,
  Button,
  Icon,
  Alert,
  AlertIcon,
  Container,
  VStack,
} from "@chakra-ui/react";
import { FaCheck, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

export default function PaymentReturn() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Extraer parámetros de la URL
  const { result, order } = router.query;

  // Verificar el pago con el backend
  const verifyPayment = async (orderId: string) => {
    try {
      setVerifying(true);
      const response = await fetch(`/api/paycomet/check-payment?order=${orderId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al verificar el pago");
      }

      // Verificar estado del pago
      const paymentStatus = data?.payment?.stateName;
      if (paymentStatus === "AUTHORIZED" || paymentStatus === "OK") {
        setSuccess(true);
      } else {
        setError(`El pago está en estado: ${paymentStatus || "Desconocido"}`);
      }
    } catch (error) {
      console.error("Error verificando pago:", error);
      setError(error instanceof Error ? error.message : "Error al verificar el pago");
    } finally {
      setVerifying(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Redireccionar si no hay sesión
    if (status === "unauthenticated") {
      router.replace("/login");
    }

    // Verificar pago cuando se carguen los parámetros
    if (status !== "loading" && order && typeof order === "string") {
      if (result === "success") {
        verifyPayment(order);
      } else {
        setSuccess(false);
        setError("El pago no se completó correctamente");
        setLoading(false);
      }
    }
  }, [router, status, order, result]);

  // Redireccionar a programas
  const goToPrograms = () => {
    router.push("/user/programs");
  };

  // Mientras se carga la sesión
  if (status === "loading" || loading) {
    return (
      <Container maxW="container.md" py={20}>
        <VStack spacing={8}>
          <Heading>Verificando resultado del pago</Heading>
          <Spinner size="xl" color="teal.500" thickness="4px" />
          <Text>Por favor, espere mientras procesamos su pago...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={20}>
      <VStack spacing={8} align="center">
        {verifying ? (
          <>
            <Heading>Verificando pago</Heading>
            <Spinner size="xl" color="teal.500" thickness="4px" />
            <Text>Estamos confirmando el estado de su pago...</Text>
          </>
        ) : success ? (
          <>
            <Flex
              w={20}
              h={20}
              bg="green.100"
              borderRadius="full"
              justify="center"
              align="center"
              mb={4}
            >
              <Icon as={FaCheck} color="green.500" fontSize="3xl" />
            </Flex>
            <Heading color="green.500">¡Pago completado con éxito!</Heading>
            <Text fontSize="lg" textAlign="center">
              Su compra ha sido procesada correctamente y ya tiene acceso al programa.
            </Text>
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              El número de referencia de su compra es: {order}
            </Alert>
          </>
        ) : (
          <>
            <Flex
              w={20}
              h={20}
              bg="red.100"
              borderRadius="full"
              justify="center"
              align="center"
              mb={4}
            >
              <Icon as={FaExclamationTriangle} color="red.500" fontSize="3xl" />
            </Flex>
            <Heading color="red.500">Pago no completado</Heading>
            <Text fontSize="lg" textAlign="center">
              {error || "Ha ocurrido un problema con su pago. Por favor, inténtelo de nuevo."}
            </Text>
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              Si el problema persiste, póngase en contacto con nuestro soporte.
            </Alert>
          </>
        )}

        <Button
          leftIcon={<FaArrowLeft />}
          colorScheme="teal"
          size="lg"
          onClick={goToPrograms}
          mt={6}
        >
          Volver a mis programas
        </Button>
      </VStack>
    </Container>
  );
}