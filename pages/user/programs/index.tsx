"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Skeleton,
} from "@chakra-ui/react";
import PayButton from "@/components/ui/PayButton"; // Asegúrate de que este componente existe

export default function UserPrograms() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [programs, setPrograms] = useState<
    { id: number; name: string; price: number; description: string }[]
  >([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  useEffect(() => {
    // Simulación de carga de datos (esto se reemplazará con una API real)
    setTimeout(() => {
      setPrograms([
        { id: 1, name: "MMS Fundamental", price: 250, description: "Nuestro programa principal de un año." },
        { id: 2, name: "MMS Avanzado", price: 150, description: "Programa de seguimiento con 1 sesión semanal." },
        { id: 3, name: "MMS VIP", price: 90, description: "Programa exclusivo con 1 sesión al mes." },
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  if (status === "loading") {
    return <Text textAlign="center">Cargando...</Text>;
  }

  return (
    <Container maxW="container.lg" py={10}>
      <Heading as="h1" size="xl" textAlign="center" mb={6} color="teal.500">
        Mis Programas
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} height="200px" borderRadius="lg" />
            ))
          : programs.map((program) => (
              <Card key={program.id} borderWidth="1px" borderRadius="lg" p={4} boxShadow="md">
                <CardBody>
                  <Heading size="md" mb={2} color="teal.600">
                    {program.name}
                  </Heading>
                  <Text fontSize="sm" mb={3} color="gray.600">
                    {program.description}
                  </Text>
                  <Text fontWeight="bold" color="teal.700">
                    {program.price}
                  </Text>
                  <PayButton name={program.name} price={program.price} />
                  </CardBody>
              </Card>
            ))}
      </SimpleGrid>
    </Container>
  );
}
