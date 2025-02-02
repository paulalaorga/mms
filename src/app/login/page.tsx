"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Divider,
} from "@chakra-ui/react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
      return;
    }

    // ✅ Obtener la sesión actualizada después del login
    const session = await getSession();

    console.log("Sesión después del login:", session);

    if (session?.user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/user");
    }
  };

  // ✅ Definir correctamente la función handleGoogleSignIn
  const handleGoogleSignIn = async () => {
    signIn("google", { callbackUrl: "/user/profile" });
  };

  return (
    <Container centerContent maxW="md" py={10}>
      <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="lg" w="100%">
        <VStack spacing={4}>
          <Heading size="lg">Iniciar Sesión</Heading>

          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="correo@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Link href="/forgot-password" passHref color="blue.500"> ¿Olvidaste tu contraseña? </Link>

            <Button colorScheme="blue" w="100%" mt={6} type="submit">
              Iniciar Sesión
            </Button>

            {/* ✅ Corregir la función onClick */}
            <Button colorScheme="red" w="100%" mt={2} onClick={handleGoogleSignIn}>
              Iniciar Sesión con Google
            </Button>
          </form>

          <Divider />

          <Text>¿No tienes una cuenta?</Text>
          <Button colorScheme="green" w="100%" onClick={() => router.push("/register")}>
            Registrarse
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}
