"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import Navbar from "../src/components/Navbar";
import NextLink from "next/link";
import { signIn, getSession } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // ✅ Cargar datos del usuario almacenados en localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  // ✅ Verificar si hay una sesión activa y redirigir
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session?.user) {
        const userRole = session.user.role;
        router.push(userRole === "admin" ? "/admin" : "/user");
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ Guardar datos de usuario en localStorage
    if (rememberMe) {
      localStorage.setItem("savedEmail", email);
      localStorage.setItem("savedPassword", password);
    } else {
      localStorage.removeItem("savedEmail");
      localStorage.removeItem("savedPassword");
    }

    // 🔹 Intentar iniciar sesión con credenciales
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Error al iniciar sesión: " + res.error);
      return;
    }

    // ✅ Esperar a que la sesión se actualice
    const session = await getSession();
    if (session?.user) {
      const userRole = session.user.role; 
      router.push(userRole === "admin" ? "/admin" : "/user");
    } else {
      setError("No se pudo obtener la sesión.");
    }
  };

  const handleGoogleSignIn = async () => {
    const res = await signIn("google", { redirect: false });

    if (res?.error) {
      setError(res.error);
      return;
    }

    const session = await getSession();
    if (session?.user) {
      const userRole = session.user.role;
      router.push(userRole === "admin" ? "/admin" : "/user");
    }
  };

  // ✅ Manejo de cambio del checkbox
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked);
  };

  return (
    <>
      <Navbar />
      <Container centerContent py={10}>
        <Box p={6} boxShadow="lg" w="100%" maxW="md">
          <Stack spacing={4} mt={6}>
            <Input
              placeholder="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Maneja el estado del correo electrónico
            />
            <Input
              placeholder="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Maneja el estado de la contraseña
            />
            <Checkbox
              isChecked={rememberMe}
              onChange={handleCheckboxChange} // Llama a la función para manejar el checkbox
            >
              Recordar mi cuenta
            </Checkbox>
            <NextLink href="/forgot-password">
              <Text as="span" color="secondary.200" cursor="pointer">
                Olvidé mi contraseña
              </Text>
            </NextLink>
            {error && <Text color="red.500">{error}</Text>} {/* Mostrar mensaje de error */}
            <Button color="secondary" size="lg" w="full" onClick={handleSubmit}>
              Iniciar sesión
            </Button>
            <Button
              colorScheme="red"
              size="lg"
              w="full"
              onClick={handleGoogleSignIn} // Llama a la función para manejar Google
              leftIcon={<FaGoogle />} // Agrega el ícono de Google al botón
            >
              Iniciar sesión con Google
            </Button>
          </Stack>
          <Text mt={4} color="gray.600" textAlign="center">
            ¿No tienes cuenta?
          </Text>
          <NextLink href="/register">
            <Text color="secondary.200" textAlign="center" cursor="pointer">
              Regístrate
            </Text>
          </NextLink>
        </Box>
      </Container>
    </>
  );
}
