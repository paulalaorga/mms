"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
} from "@chakra-ui/react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Token inválido o expirado.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess("Tu contraseña ha sido restablecida con éxito.");
      setTimeout(() => router.push("/login"), 3000);
    } else {
      setError(data.message);
    }
  };

  return (
    <Container centerContent maxW="md" py={10}>
      <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="lg" w="100%">
        <VStack spacing={4}>
          <Heading size="lg">Restablecer Contraseña</Heading>
          <Text color="gray.500">Ingresa una nueva contraseña</Text>

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

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <FormControl isRequired>
              <FormLabel>Nueva Contraseña</FormLabel>
              <Input
                type="password"
                placeholder="********"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Confirmar Contraseña</FormLabel>
              <Input
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>

            <Button colorScheme="blue" w="100%" mt={6} type="submit">
              Restablecer Contraseña
            </Button>
          </form>
        </VStack>
      </Box>
    </Container>
  );
}
