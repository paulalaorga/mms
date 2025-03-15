// pages/payments/payment-success.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container, Heading, Text, Button, VStack, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

export default function PaymentSuccess() {
  const router = useRouter();
  const { data: session } = useSession();
  const { r: orderId, i: amount, ret: returnCode } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId || !session?.user) return;

    const confirmPayment = async () => {
      try {
        console.log("Confirmando pago para orden:", orderId);
        
        // Llamar al endpoint de confirmación
        const response = await fetch("/api/paycomet/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            amount: amount ? Number(amount) / 100 : 0, // Convertir de céntimos a euros
            returnCode,
            programId: router.query.programId || sessionStorage.getItem("lastProgramId"),
                    }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al confirmar el pago");
        }

        // Éxito, mostrar mensaje y redirigir después de un tiempo
        setLoading(false);
        setTimeout(() => {
          router.push("/user/programs");
        }, 3000);
      } catch (err) {
        console.error("Error confirmando pago:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
        setLoading(false);
      }
    };

    confirmPayment();
  }, [orderId, amount, returnCode, router, session]);

  if (loading) {
    return (
      <Container maxW="container.md" centerContent py={10}>
        <VStack spacing={6}>
          <Spinner size="xl" />
          <Heading size="lg">Procesando tu pago...</Heading>
          <Text>Por favor, espera mientras confirmamos tu compra.</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" centerContent py={10}>
        <VStack spacing={6}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
          <Text>Hubo un problema al procesar tu pago.</Text>
          <Button colorScheme="teal" onClick={() => router.push("/user/programs")}>
            Volver a mis programas
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" centerContent py={10}>
      <VStack spacing={6}>
        <Heading color="green.500">¡Pago Exitoso! 🎉</Heading>
        <Text fontSize="lg">
          Tu pago de {amount ? (Number(amount) / 100).toFixed(2) : "0"}€ ha sido procesado correctamente.
        </Text>
        <Text>Serás redirigido a tus programas en unos segundos...</Text>
        <Button colorScheme="teal" onClick={() => router.push("/user/programs")}>
          Ver mis programas ahora
        </Button>
      </VStack>
    </Container>
  );
}