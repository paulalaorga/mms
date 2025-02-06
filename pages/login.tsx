"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Checkbox,
  Container,
  Stack,
  Text,
  Button,
} from "@chakra-ui/react";

import Navbar from "../src/components/layout/Navbar";
import NextLink from "next/link";
import { signIn, getSession } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import MyButton from "@/components/ui/Button";
import CallToAction from "@/components/layout/CallToAction";

// ✅ Validar formato de email
const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // ✅ Cargar datos almacenados en localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  // ✅ Verificar sesión activa
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

  // ✅ Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");

    const formattedEmail = email.trim().toLowerCase(); // 🔹 Convertir email a minúsculas

    let isValid = true;

    if (!validateEmail(formattedEmail)) {
      setEmailError("Correo electrónico inválido");
      isValid = false;
    }

    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      isValid = false;
    }

    if (!isValid) return;

    // ✅ Guardar en localStorage solo si es válido
    if (rememberMe) {
      localStorage.setItem("savedEmail", formattedEmail);
      localStorage.setItem("savedPassword", password);
    } else {
      localStorage.removeItem("savedEmail");
      localStorage.removeItem("savedPassword");
    }

    try {
      const res = await signIn("credentials", {
        email: formattedEmail, // ✅ Se usa el email en minúsculas
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Error al iniciar sesión: " + res.error);
        return;
      }

      const session = await getSession();
      if (session?.user) {
        const userRole = session.user.role;
        router.push(userRole === "admin" ? "/admin" : "/user");
      } else {
        setError("No se pudo obtener la sesión.");
      }
    } catch (error) {
      setError("Error inesperado al iniciar sesión: " + error);
    }
  };

  // ✅ Manejar Login con Google
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

  // ✅ Detectar `Enter` para enviar formulario
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <>
      <Navbar />
      <Box bg="brand.200" py={19} height={"100vh"} overflow={"hidden"}>
        <Container centerContent py={1} borderRadius="md">
          <Text fontSize="3xl" fontWeight="bold" color="white">
            Iniciar sesión
          </Text>
          <Box p={6} w="100%" maxW="md" border={1} borderRadius="md">
            {error && <Alert status="error" title={error} />}
            <Stack spacing={4} border={1} borderRadius="md">
            <NextLink href="/register">
                  <Text color="accent.50" textAlign="center" cursor="pointer">
                    ¿Todavía no tienes cuenta? Regístrate aquí
                  </Text>
                </NextLink>
              <Input
                bg="white"
                placeholder="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                onKeyDown={handleKeyDown} // ✅ Permite `Enter`
              />
              <Input
                bg="white"
                placeholder="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                onKeyDown={handleKeyDown} // ✅ Permite `Enter`
              />
              <Checkbox
                color="whiteAlpha.800"
                isChecked={rememberMe}
                onChange={handleCheckboxChange}
              >
                Recordar mi cuenta
              </Checkbox>
              <Text textAlign="center">
                <NextLink href="/forgot-password">
                  <Text as="span" color="accent.50" cursor="pointer">
                    ¿Olvidaste la contraseña?
                  </Text>
                </NextLink>
               
              </Text>
              <MyButton
                variant="outline"
                size="lg"
                w="full"
                onClick={handleSubmit}
              >
                Iniciar sesión
              </MyButton>
              <Button
                colorScheme="red"
                size="lg"
                w="full"
                onClick={handleGoogleSignIn}
                leftIcon={<FaGoogle />}
              >
                Iniciar sesión con Google
              </Button>
            </Stack>
          </Box>
        </Container>
        <CallToAction />
      </Box>
    </>
  );
}
