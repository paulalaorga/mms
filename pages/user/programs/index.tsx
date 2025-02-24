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
  Stack,
  Divider,
} from "@chakra-ui/react";
import PayButton from "@/components/payments/PayButton"; // Asegúrate de que este componente existe

type PricingOption = {
  period: "monthly" | "yearly" | "weekly";
  price: number;
  billingCycles?: number;
};

type ProgramType = {
  _id: string;
  name: string;
  description: string;
  groupLevel: "Fundamental" | "Avanzado" | "VIP";
  paymentType: "subscription" | "one-time";
  pricingOptions: PricingOption[];
  subscriptionDetails?: {
    periodicity: "monthly" | "weekly" | "yearly";
    duration: number;
  };
};

export default function UserPrograms() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [userLevel, setUserLevel] = useState<string>("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    fetch("/api/user/programs")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("❌ Error al cargar programas:", data.error);
          setPrograms([]);
        } else {
          setPrograms(data);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));

    if (session.user.groupLevel) {
      setUserLevel(session.user.groupLevel);
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <Text textAlign="center">Cargando...</Text>;
  }

  return (
    <Container maxW="container.lg" py={10}>
      <Heading as="h1" size="xl" textAlign="center" mb={6} color="teal.500">
        Programas Disponibles para {userLevel || "tu nivel"}
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} >
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} height="200px" borderRadius="lg" />
          ))
        ) : programs.length > 0 ? (
          programs.map((program) => (
            <Card
              key={program._id}
              borderWidth="1px"
              borderRadius="lg"
              textAlign={"center"}
              p={4}
              boxShadow="md"
            >
              <CardBody>
                <Heading size="md" mb={2} color="teal.600">
                  {program.name}
                </Heading>
                <Text fontSize="sm" mb={3} color="gray.600">
                  {program.description}
                </Text>

                <Stack display={"flex"} flexDirection={"column"} spacing={2} mt={4}>
                  {program.pricingOptions.map((option) => (
                    <Stack key={option.period} align="left">
                      <Text textAlign={"left"} color="teal.700">
                        {option.period === "monthly"
                          ? "P Mensual de "
                          : option.period === "yearly"
                          ? "Pago único de "
                          : option.period === "weekly"
                          ? "Semanal"
                          : option.period}
                         {option.price}€
                      </Text>
                      <PayButton
                        programId={program._id}
                        name={program.name}
                        price={option.price}
                        paymentType={program.paymentType}
                        subscriptionDetails={
                          program.paymentType === "subscription"
                            ? { periodicity: option.period, duration: 12 }
                            : undefined
                        }
                      />
                      <Divider mt={3}/>
                    </Stack>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          ))
        ) : (
          <Text textAlign="center" color="gray.500">
            No hay programas disponibles para tu nivel.
          </Text>
        )}
      </SimpleGrid>
    </Container>
  );
}
