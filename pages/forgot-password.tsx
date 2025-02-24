"use client";

import { useState } from "react";
import {
  Box,
  Container,
  VStack,
  Alert,
  AlertIcon,
  Text,
  Heading,
  FormControl,
} from "@chakra-ui/react";

import Navbar from "@/components/layout/Navbar";
import NextLink from "next/link";
import Input from "@/components/ui/Input";
import MyButton from "@/components/ui/Button";
import CallToAction from "@/components/layout/CallToAction";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ Asegura que el backend lo interprete correctamente
        },
        body: JSON.stringify({ email: email.trim() }), // ✅ Asegura que `email` tiene contenido
      });

      console.log("📌 Respuesta del servidor:", res);

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("❌ Error en la solicitud:", err);
      setError("Error en la solicitud.");
    }
  };

  return (
    <>
      <Navbar />
      <Box
        bg="brand.200"
        minH="88vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Container maxW="md" centerContent>
          <Box p={6} w="100%" maxW="md" border={1} borderRadius="md">
          <VStack spacing={4} >
            <Heading fontSize="3xl" fontWeight="bold" color="white">
              Recuperar Contraseña
            </Heading>
            {message && (
              <Alert status="success">
                <AlertIcon /> {message}
              </Alert>
            )}
            {error && (
              <Alert status="error">
                <AlertIcon /> {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <FormControl isRequired mt={4}>
              <Input
                bg="white"
                placeholder="Ingresa tu correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              </FormControl>

              <MyButton
                variant="outline"
                size="lg"
                w="full"
                mt={6}
                onClick={handleSubmit}
              >
                Enviar Correo de Recuperación
              </MyButton>
            </form>
            
            <NextLink href="/login">
              <Text
                mt={4}
                color="secondary.200"
                textAlign="center"
                cursor="pointer"
              >
                Volver al inicio de sesión
              </Text>
            </NextLink>
            </VStack>
          </Box>
        </Container>
        <CallToAction />
      </Box>
    </>
  );
}
