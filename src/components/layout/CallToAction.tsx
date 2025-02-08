import { Box, Button, Flex, Icon } from "@chakra-ui/react";
import { FaWhatsapp } from "react-icons/fa";

const CallToAction = () => {


    return (
        <>
        <Flex
            direction="column"
            align="center"
            justify="center"
            bg="black.50"
            position={"fixed"}
            bottom={0}
            w={"full"}
            color="white"
            py={6}
            px={6}
            zIndex={999}
        >
            <Box textAlign={"center"}>
                <p>Si tienes dudas o quieres empezar, te ayudamos:</p>
            </Box>
            <Button
                as={"a"}
                href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1KnFzTbvV2h3w3zRt7JvgMK2o6riazDBa-Bhsqkf1egM-EOJultetcPVZgcX6wuedOjPmQdqYT" 
                target="blank"
                color="black"
                bg={"accent.50"}
                variant="solid"
                rounded={"full"}
                mt={4}
                _hover={{ textDecoration: "underline", bg: "white" }}
            >
                Agenda una consulta gratuita
            </Button>
        </Flex>
        <Button
            as="a"
            href="https://wa.me/618720385?text=Hola,%20quiero%20agendar%20una%20consulta%20gratuita."
            target="_blank"
            rel="noopener noreferrer"
            position="fixed"
            bottom="50px"
            right="50px"
            bg="none"
            p={4}
            rounded="full"
            boxShadow="lg"
            zIndex={1000}
            _hover={{
                transform: "scale(1.1)", // Efecto sutil al pasar el mouse
                bg: "transparent" // No cambia el color de fondo
            }}
        >
            <Icon as={FaWhatsapp} boxSize={20} color={"green"} />
        </Button>
        </>
    );
}

export default CallToAction;