import { Box, Button, Flex, Icon } from "@chakra-ui/react";
import { FaWhatsapp } from "react-icons/fa";

const CallToAction = () => {
    return (
        <>
            {/* Contenedor principal del CTA */}
            <Flex
                direction="column"
                align="center"
                justify="center"
                bg="black.50"
                position="fixed"
                bottom={0}
                w="full"
                color="white"
                py={4} // Menos padding en móviles
                px={6}
                zIndex={999}
                textAlign="center"
            >
                <Box maxW="90%"> {/* Evita que el texto sea demasiado ancho */}
                    <p>Si tienes dudas o quieres empezar, te ayudamos:</p>
                </Box>
                <Button
                    as="a"
                    href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1KnFzTbvV2h3w3zRt7JvgMK2o6riazDBa-Bhsqkf1egM-EOJultetcPVZgcX6wuedOjPmQdqYT"
                    target="_blank"
                    color="black"
                    bg="accent.50"
                    variant="solid"
                    rounded="full"
                    mt={3} // Menos margen en móviles
                    px={[4, 6, 8]} // Ajuste dinámico de padding en el botón
                    py={[2, 3, 4]}
                    _hover={{
                        transform: "scale(1.1)", // Efecto de zoom al pasar el mouse
                    }}
                >
                    Agenda una consulta gratuita
                </Button>
            </Flex>

            {/* Botón flotante de WhatsApp */}
            <Button
                as="a"
                href="https://wa.me/618720385?text=Hola,%20quiero%20agendar%20una%20consulta%20gratuita."
                target="_blank"
                rel="noopener noreferrer"
                position="fixed"
                bottom={["50px", "50px", "50px"]} // Se ajusta en móviles y escritorio
                right={["10px", "10px", "50px"]}
                bg="none"
                pt={[3, 4, 10, 5]} // Tamaño ajustable
                rounded="full"
                boxShadow="lg"
                zIndex={1000}
                _hover={{
                    transform: "scale(1.1)", // Efecto sutil al pasar el mouse
                    bg: "transparent" // No cambia el color de fondo
                }}
                display={["flex", "flex", "flex"]} // Siempre visible en todas las pantallas
            >
                <Icon as={FaWhatsapp} boxSize={["10", "14", "16"]} color="green" />
            </Button>
        </>
    );
};

export default CallToAction;
