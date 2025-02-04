"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import Navbar from "../src/components/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Agregar estado para confirmar contraseña
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validar que las contraseñas coinciden
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Validar que los campos no estén vacíos
    if (!name || !email || !password) {
      setError("Por favor, llena todos los campos.");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess("Registro exitoso. Redirigiendo al login...");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setError(data.error || "Error al registrar el usuario.");
    }
  };

  return (
    <>
      <Navbar />
      <Container centerContent maxW="md" py={10}>
        <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="lg" w="100%">
          <Stack spacing={4} mt={6}>
            <Heading size="lg" textAlign="center">Regístrate</Heading>
            <Text color="gray.500" textAlign="center">Crea tu cuenta para acceder</Text>
            
            {error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}

            {success && (
              <Alert status="success">
                <AlertIcon />
                {success}
              </Alert>
            )}

            <form onSubmit={handleRegister} style={{ width: "100%" }}>
              <FormControl isRequired>
                <FormLabel>Nombre</FormLabel>
                <Input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired mt={4}>
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

              <FormControl isRequired mt={4}>
                <FormLabel>Confirmar contraseña</FormLabel>
                <Input
                  type="password"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </FormControl>

              <Button colorScheme="green" w="100%" mt={6} type="submit">
                Registrarse
              </Button>
            </form>
          </Stack>
        </Box>
      </Container>
    </>
  );
}
