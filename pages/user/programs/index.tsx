"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
} from "@chakra-ui/react";

export default function UserPrograms() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <Text>Cargando...</Text>;
  }

  // Simulación de productos
  const products = [
    { id: 1, name: "Plan Básico", price: "10€", description: "Acceso limitado a contenido" },
    { id: 2, name: "Plan Estándar", price: "20€", description: "Acceso a todo el contenido" },
    { id: 3, name: "Plan Premium", price: "30€", description: "Beneficios exclusivos y soporte prioritario" },
  ];

  const handlePurchase = (productId: number) => {
    alert(`Redirigiendo al pago del producto ${productId}`);
    // Aquí podrías redirigir a una pasarela de pago (Stripe, PayPal, etc.)
  };

  return (
    <Container centerContent py={10}>
      <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="lg" w="100%" maxW="md">
        <VStack spacing={4}>
          <Heading size="lg">Opciones de Compra</Heading>
          <Text>Elige el plan que mejor se adapte a tus necesidades.</Text>

          <SimpleGrid columns={1} spacing={4} w="100%">
            {products.map((product) => (
              <Card key={product.id} borderWidth={1} p={4}>
                <CardBody>
                  <Heading size="md">{product.name}</Heading>
                  <Text>{product.description}</Text>
                  <Text fontWeight="bold" mt={2}>{product.price}</Text>
                  <Button colorScheme="blue" mt={4} w="100%" onClick={() => handlePurchase(product.id)}>
                    Comprar
                  </Button>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Box>
    </Container>
  );
}
