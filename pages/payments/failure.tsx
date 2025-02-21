import { useRouter } from "next/router";
import { Container, Heading, Button } from "@chakra-ui/react";

export default function PaymentFailure() {
  const router = useRouter();

  return (
    <Container textAlign="center" mt={10}>
      <Heading color="red.500">Pago Fallido ❌</Heading>
      <Button mt={4} onClick={() => router.push("/user/programs")} colorScheme="teal">
        Volver a intentar
      </Button>
    </Container>
  );
}
