"use client";

import { Box, Button, Container, Heading, Text, VStack, Icon } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const searchParams = useSearchParams(); // ✅ Mejor forma de obtener parámetros en Next.js
  const router = useRouter();

  const userId = searchParams.get("userId");
  const userName = searchParams.get("userName");
  const programId = searchParams.get("programId");
  const orderId = searchParams.get("orderId");
  const programName = searchParams.get("programName");

  useEffect(() => {
    // ❌ No llamar `confirm.ts` si faltan datos esenciales
    if (!userId || !programId || !orderId || !programName || !userName) {
      console.error("❌ Faltan datos para confirmar el pago.");
      return;
    }

    console.log("📩 Enviando datos de confirmación a `confirm.ts`...");

    fetch("/api/payments/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName,
        userId,
        programId,
        orderId,
        programName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("❌ Error al confirmar la compra:", data.error);
          return;
        }
        console.log("✅ Confirmación de compra exitosa:", data);
      })
      .catch((err) => console.error("❌ Error en la solicitud a confirm.ts:", err));
  }, [userId, userName, programId, orderId, programName]); // ✅ Dependencias correctas

  // ✅ Función para capitalizar nombres correctamente
  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "Usuario";

  return (
    <Container maxW="container.md" centerContent py={10}>
      <Box textAlign="center" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="green.50">
        <Icon as={CheckCircleIcon} boxSize={14} color="green.500" />
        <Heading as="h1" size="xl" color="green.600" mt={4}>
          ¡Muchas gracias {capitalize(userName || "Usuario")}!
        </Heading>
        <Text fontSize="lg" color="gray.600" mt={2}>
          Tu pago se ha procesado correctamente. 🎉
        </Text>
        <Text fontSize="md" color="gray.500" mt={2}>
          Ahora tienes acceso a {programName} desde tu área de usuario.
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
