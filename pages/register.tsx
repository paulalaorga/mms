"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Stack,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

import Navbar from "../src/components/layout/Navbar";
import NextLink from "next/link";
import Input from "@/components/ui/Input";
import MyButton from "@/components/ui/Button";
import CallToAction from "@/components/layout/CallToAction";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

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
      <Box bg="brand.200" py={20}>
        <Container centerContent py={1} borderRadius="md">
          <Text fontSize="3xl" fontWeight="bold" color="white">
            Crea tu cuenta
          </Text>
          <Box p={6} w="100%" maxW="md" border={1} borderRadius="md">
            {error && (
              <Alert status="error">
                <AlertIcon /> {error}
              </Alert>
            )}
            {success && (
              <Alert status="success">
                <AlertIcon /> {success}
              </Alert>
            )}
            <Stack spacing={4} border={1} borderRadius="md" p={6}>
              <Input
                bg="white"
                placeholder="Nombre"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                bg="white"
                placeholder="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                bg="white"
                placeholder="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                bg="white"
                placeholder="Confirmar contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <MyButton variant="outline" size="lg" w="full" onClick={handleRegister}>
                Registrarse
              </MyButton>
            </Stack>
            <NextLink href="/login">
              <Text mt={4} color="secondary.200" textAlign="center" cursor="pointer">
                ¿Ya tienes cuenta? Inicia sesión aquí
              </Text>
            </NextLink>
          </Box>
        </Container>
        <CallToAction />
      </Box>
    </>
  );
}
