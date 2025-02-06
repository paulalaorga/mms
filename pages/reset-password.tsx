"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  VStack,
  Heading,
  Alert,
  AlertIcon,
  Input,
} from "@chakra-ui/react";

import Navbar from "@/components/layout/Navbar";
import MyButton from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Leer token correctamente
  useEffect(() => {
    const urlToken = searchParams.get("token");
    setToken(urlToken);
    console.log("🔍 Token recibido:", urlToken);
  }, [searchParams]);

  // ✅ Manejo del formulario
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

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      console.log("📌 Respuesta de la API:", data);

      if (res.ok) {
        setSuccess("Tu contraseña ha sido restablecida con éxito.");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("❌ Error en la API:", err);
      setError("Error en el servidor. Inténtalo más tarde.");
    }
  };

  return (
    <>
      <Navbar />
      <Box bg="brand.200" py={20} minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Container maxW="md" centerContent>
          <Box p={6} w="100%" maxW="md" border={1} borderRadius="md" bg="white">
            <VStack spacing={4}>
              <Heading size="lg">Restablecer Contraseña</Heading>

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

                <MyButton variant="outline" size="lg" w="full" mt={6} type="submit">
                  Restablecer Contraseña
                </MyButton>
              </form>
            </VStack>
          </Box>
        </Container>
      </Box>
    </>
  );
}
