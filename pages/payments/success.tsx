import { useEffect } from "react";
import { useRouter } from "next/router";
import { Container, Heading, Text } from "@chakra-ui/react";

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/user/profile");
    }, 3000);
  }, [router]);

  return (
    <Container textAlign="center" mt={10}>
      <Heading color="green.500">¡Pago Exitoso! 🎉</Heading>
      <Text>Redirigiéndote a tu perfil...</Text>
    </Container>
  );
}
