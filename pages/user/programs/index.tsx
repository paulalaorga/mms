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
  Divider,
} from "@chakra-ui/react";
import PayButton from "@/components/payments/PayButton";
import SubscriptionButton from "@/components/payments/SubscribeButton";
import Link from "next/link";
import { IPurchasedProgram } from "@/models/Purchase";
import { IProgram } from "@/models/Program";

export default function UserPrograms() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [purchasedPrograms, setPurchasedPrograms] = useState<IPurchasedProgram[]>([]);
  const [availablePrograms, setAvailablePrograms] = useState<IProgram[]>([]);

  const fetchPrograms = async () => {
    setIsLoading(true);
    const res = await fetch("/api/user/programs");
    const data = await res.json();

    if (data.error) {
      console.error("❌ Error al cargar programas:", data.error);
      setPurchasedPrograms([]);
      setAvailablePrograms([]);
    } else {
      setPurchasedPrograms(data.purchasedPrograms || []);
      setAvailablePrograms(data.availablePrograms || []);
    }
    setIsLoading(false);
  };

  const userName = session?.user?.name || "Usuario Desconocido"; // Evita errores si es undefined

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    fetchPrograms();
  }, [session, status, router]);

  // 🔹 Función para recargar datos tras el pago
  const handlePaymentSuccess = async () => {
    console.log("💸 Pago completado. Actualizando programas...");
    await fetchPrograms();
    await update(); // 🔄 Recargar sesión para asegurarse de que se actualizan los datos
  };

  const handleSubscriptionSuccess = async () => {
    console.log("💸 Suscripción completada. Actualizando programas...");
    await fetchPrograms();
    await update(); // 🔄 Recargar sesión para asegurarse de que se actualizan los dato
  };



  return (
    <Container maxW="container.lg" py={10}>
      <Heading as="h1" size="xl" textAlign="center" mb={6} color="teal.500">
        Mis Programas
      </Heading>

      {isLoading ? (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} height="200px" borderRadius="lg" />
          ))}
        </SimpleGrid>
      ) : (
        <>
          {purchasedPrograms.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {purchasedPrograms.map(
                ({
                  purchasePaymentId,
                  programId,
                  programName,
                  description,
                  purchaseDate,
                }) => (
                  <Card
                    key={purchasePaymentId}
                    borderWidth="1px"
                    borderRadius="lg"
                    textAlign="center"
                    p={4}
                    boxShadow="md"
                  >
                    <CardBody>
                      <Heading size="md" mb={2} color="teal.600">
                        {programName || "Nombre no disponible"}{" "}
                        {/* ✅ Evita errores si programId es null */}
                      </Heading>
                      <Text fontSize="sm" mb={3} color="gray.600">
                        {description || "Descripción no disponible"}{" "}
                        {/* ✅ Evita errores */}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Inicio: {new Date(purchaseDate).toLocaleDateString()}
                      </Text>
                      {/* 🔹 Enlace para ver el programa */}
                      <Link
                        href={`/user/index?programId=${programId?._id}`}
                        passHref
                      >
                        <Text
                          color="blue.500"
                          fontWeight="bold"
                          mt={2}
                          cursor="pointer"
                        >
                          Ver Programa
                        </Text>
                      </Link>
                    </CardBody>
                  </Card>
                )
              )}
            </SimpleGrid>
          ) : (
            <Text textAlign="center" color="gray.500">
              Aún no tienes programas activos.
            </Text>
          )}

          {availablePrograms.length > 0 && (
            <>
              <Heading
                as="h2"
                size="lg"
                textAlign="left"
                mt={10}
                mb={4}
                color="teal.400"
              >
                Programas Disponibles
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {availablePrograms.map((program) => {
                  console.log("🔍 Programa disponible:", program);

                  return (
                    <Card
                      key={String(program._id)} // ✅ Aseguramos que programId sea string
                      borderWidth="1px"
                      borderRadius="lg"
                      textAlign="center"
                      p={4}
                      boxShadow="md"
                    >
                      <CardBody>
                        <Heading size="md" mb={2} color="teal.600">
                          {program.programName}
                        </Heading>
                        <Text fontSize="sm" mb={3} color="gray.600">
                          {program.description}
                        </Text>

                        {/* ✅ Iteramos sobre todas las opciones de pago */}
                        {program.paymentOptions.map((option, index) => (
                          <div
                            key={index}
                            style={{ marginTop: "10px" }}
                          >
                            {option.type === "one-time" ? (
                              <PayButton
                                _id={program._id}
                                userName={userName}
                                programName={program.programName}
                                price={option.price}
                                onPaymentSuccess={handlePaymentSuccess}
                              />
                            ) : option.type === "subscription" ? (
                              <SubscriptionButton
                                _id={program._id}
                                userName={userName}
                                programName={program.programName}
                                price={option.price}
                                subscriptionDuration={
                                  option.subscriptionDetails?.duration
                                }
                                subscriptionRenewalPeriod={
                                  option.subscriptionDetails?.renewalPeriod
                                }
                                onSubscriptionSuccess={
                                  handleSubscriptionSuccess
                                }
                              />
                            ) : (
                              <Text color="red.500">
                                ⚠️ Tipo de pago desconocido
                              </Text>
                            )}
                          </div>
                        ))}

                        <Divider mt={3} />
                      </CardBody>
                    </Card>
                  );
                })}
              </SimpleGrid>
            </>
          )}
        </>
      )}
    </Container>
  );
}
