"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Heading,
  Text,
  SimpleGrid,
  Skeleton,
  Divider,
  Box,
  Flex,
} from "@chakra-ui/react";
import MyButton from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PayButton from "@/components/payments/PayButton";
import { IPurchasedProgram } from "@/models/Purchase";
import { IProgram } from "@/models/Program";

export default function UserPrograms() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [purchasedPrograms, setPurchasedPrograms] = useState<IPurchasedProgram[]>([]);
  const [availablePrograms, setAvailablePrograms] = useState<IProgram[]>([]);
  const [loadingProgram, setLoadingProgram] = useState<string | null>(null);

  const fetchPrograms = async () => {
    setIsLoading(true);
    const res = await fetch("/api/user/programs");
    const data = await res.json();
  
    if (data.error) {
      console.error("❌ Error al cargar programas:", data.error);
      setPurchasedPrograms([]);
      setAvailablePrograms([]);
    } else {
      const purchasedPrograms = data.purchasedPrograms || [];
      const allPrograms = data.availablePrograms || [];
  
      // 🔍 Filtrar los programas disponibles, excluyendo los ya comprados
      const purchasedProgramIds = new Set(purchasedPrograms.map((p: IPurchasedProgram) => p.programId));
      const filteredPrograms = allPrograms.filter((program: IProgram) => !purchasedProgramIds.has(program._id));
  
      setPurchasedPrograms(purchasedPrograms);
      setAvailablePrograms(filteredPrograms); // 🔥 Ahora sí excluye los comprados
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

/*   const handleSubscriptionSuccess = async () => {
    console.log("💸 Suscripción completada. Actualizando programas...");
    await fetchPrograms();
    await update(); // 🔄 Recargar sesión para asegurarse de que se actualizan los dato
  };
 */


  return (
    <Box py={10} maxW="container.xl" mx="auto">
      <Box className="max-w-6xl mx-auto py-6">
        <Heading as="h1" size="xl" textAlign="center" mb={6} color="teal.600">
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
            {/* Programas Activos */}
            {purchasedPrograms.length > 0 && (
              <Box mb={8}>
                <Heading as="h2" size="lg" mb={4} color="teal.600">
                  Tus Programas Actuales
                </Heading>
                
                {purchasedPrograms.map(({
                  orderId,
                  programName,
                  description,
                }) => (
                  <Box 
                    key={orderId} 
                    p={5} 
                    mb={4}
                    rounded="lg" 
                    bg="white" 
                    border="1px" 
                    borderColor="gray.200" 
                    shadow="md"
                  >
                    <Flex flexDir={{ base: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }}>
                      <Box>
                        <Flex alignItems="center" mb={2}>
                          <Heading as="h3" size="md" mr={2}>
                            {programName || "Nombre no disponible"}
                          </Heading>
                          <Badge
                            text="Activo"
                            variant="success"
                          />
                        </Flex>
                        
                        <Text color="gray.600" mb={2}>
                          {description || "Descripción no disponible"}
                        </Text>
                        
{/*                         <Flex alignItems="center">
                          <Text mr={2}>👥</Text>
                          <Text fontWeight="medium">
                            Próxima sesión grupal: {nextSession}
                          </Text>
                        </Flex>
 */}                      </Box>
                      
                      <MyButton
                        mt={{ base: 4, md: 0 }}
                        colorScheme="teal"
                        px={4}
                        py={2}
                        display="flex"
                        alignItems="center"
                      >
                        <Text>Ver Detalles</Text>
                        <Text ml={2}>➡️</Text>
                      </MyButton>
                    </Flex>
                  </Box>
                ))}
              </Box>
            )}

            {/* Programas Disponibles */}
            {availablePrograms.length > 0 && (
              <>
                <Heading as="h2" size="lg" mb={4} color="teal.600">
                  Programas Disponibles
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {availablePrograms.map((program) => {
                    // Determinar el nivel del programa para estilos y etiquetas
                    const level = program.groupLevel || "Fundamental";
                    const levelColor = 
                      level === "Fundamental" ? "teal.500" : 
                      level === "Avanzado" ? "blue.500" : 
                      level === "Individual" ? "purple.500" : "orange.500";
                    
                    const levelText = 
                      level === "Fundamental" ? "Programa Grupal Básico" : 
                      level === "Avanzado" ? "Programa Grupal Avanzado" : 
                      level === "Individual" ? "Terapia Individual" : "Programa de Mantenimiento";

                    // Extraer opciones de pago del programa
/*                     const paymentOptions = program.paymentOptions || [];
 */                    
                    return (
                      <Box
                        key={program._id.toString()}
                        rounded="lg"
                        overflow="hidden"
                        border="1px"
                        borderColor="gray.200"
                        bg="white"
                        shadow="md"
                      >
                        <Box p={4}>
                          <Flex justifyContent="space-between" alignItems="center" mb={3}>
                            <Heading as="h3" size="md" color="teal.600">
                              {program.programName}
                            </Heading>
                          </Flex>
                          
                          <Flex alignItems="center" mb={2} color={levelColor}>
                            <Text mr={2}>👥</Text>
                            <Text fontWeight="medium">
                              {levelText}
                            </Text>
                          </Flex>
                          
                          <Text color="gray.600" mb={4}>
                            {program.description}
                          </Text>
                        </Box>
                        
                        <Divider />
                        
                        <Box p={4}>
                          {program.paymentOptions && program.paymentOptions.map((option, idx) => (
                            <Box key={idx} mb={3} _last={{ mb: 0 }}>
                              <Flex justifyContent="space-between" alignItems="center" mb={1}>
                                <Text>
                                  {option.type === "subscription" ? "Pago Mensual" : "Pago Único"}
                                </Text>
                                <Text fontWeight="bold">
                                  {option.price}€ {option.type === "subscription" && "/mes"}
                                </Text>
                              </Flex>
                              
                              {option.type === "one-time" ? (
                                <MyButton
                                  w="full"
                                  py={2}
                                  rounded="md"
                                  fontWeight="medium"
                                  colorScheme={idx === 0 ? "teal" : undefined}
                                  variant={idx === 0 ? "primary" : "outline"}
                                  isLoading={loadingProgram === `${program._id}-${option.type}`}
                                  loadingText="Procesando..."
                                  onClick={() => {
                                    setLoadingProgram(`${program._id}-${option.type}`);
                                    setTimeout(() => {
                                      // Usar el componente PayButton pero llamar a su función aquí
                                      handlePaymentSuccess();
                                      setLoadingProgram(null);
                                    }, 1000);
                                  }}
                                >
{/*                                   {option.type === "subscription" ? "Suscribirme" : "Pago único"}
 */}                                </MyButton>
                              ) : (
                                <PayButton
                                  _id={program._id}
                                  userName={userName}
                                  programName={program.programName}
                                  price={option.price}
                                  expirationDate={program.expirationDate}
                                  onPaymentSuccess={handlePaymentSuccess}
                                />
                              )}
                            </Box>
                          ))}

                          {!program.paymentOptions || program.paymentOptions.length === 0 && (
                            <Text color="gray.500" textAlign="center">
                              No hay opciones de pago disponibles.
                            </Text>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </SimpleGrid>
              </>
            )}

            {/* Mensaje si no hay programas */}
            {purchasedPrograms.length === 0 && availablePrograms.length === 0 && (
              <Text textAlign="center" color="gray.500" mt={8}>
                No hay programas disponibles en este momento.
              </Text>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}