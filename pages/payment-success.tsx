"use client";

import { Box, Button, Container, Heading, Text, VStack, Icon } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get('userId');
  const userName = searchParams.get('userName');
  const programId = searchParams.get('programId');
  const paymentId = searchParams.get('paymentId');
  const programName = searchParams.get('programName');

  useEffect(() => {
    const confirmPurchase = async () => {
      const res = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          userId,
          programId,
          paymentId,
          programName,
        }),
      });

      const data = await res.json();
      console.log("🔹 Confirmación de compra:", data);
    };
    confirmPurchase();
  }, [userName, userId, programId, paymentId, programName]);

  return (
    <Container maxW="container.md" centerContent py={10}>
      <Box
        textAlign="center"
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="green.50"
      >
        <Icon as={CheckCircleIcon} boxSize={14} color="green.500" />
        <Heading as="h1" size="xl" color="green.600" mt={4}>
          ¡Pago Exitoso!
        </Heading>
        <Text fontSize="lg" color="gray.600" mt={2}>
          Muchas gracias {userName}! Tu pago se ha procesado correctamente. 🎉  
        </Text>
        <Text fontSize="md" color="gray.500" mt={2}>
          Ahora tienes acceso a {programName}. Revisa tu área de usuario para más detalles.
        </Text>

        <VStack spacing={4} mt={6}>
          <Button colorScheme="teal" size="lg" onClick={() => router.push("/user/programs")}>
            Ir a Mis Programas
          </Button>
          <Button variant="link" color="gray.600" onClick={() => router.push("/")}>
            Volver al Inicio
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default PaymentSuccess;
