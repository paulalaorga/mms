"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  FormControl,
  Checkbox,
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
      setError("Error al inicair sesión: " + res.error);
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
              <Input
                type="email"
                placeholder="correo@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <Input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%", // Para evitar que los elementos se amontonen en pantallas pequeñas
                marginTop: "10px",
              }}
            >
              {/* ✅ Checkbox para recordar sesión */}
              <Checkbox
                isChecked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              >
                Recordarme
              </Checkbox>

              <Link
                href="/forgot-password"
                passHref
                style={{
                  color: "#3182CE", // Azul de Chakra UI para mejor visibilidad
                  textDecoration: "underline", // Subrayado para indicar que es un enlace
                  marginLeft: "auto", // Empuja el enlace a la derecha
                }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              colorScheme="blue"
              w="100%"
              mt={6}
              type="submit"
            >
              Iniciar Sesión
            </Button>

            {/* ✅ Corregir la función onClick */}
            <Button
              colorScheme="red"
              w="100%"
              mt={2}
              onClick={handleGoogleSignIn}
            >
              Iniciar Sesión con Google
            </Button>
          </form>

          <Divider />

          <Text>¿No tienes una cuenta?</Text>
          <Button
            colorScheme="green"
            w="100%"
            onClick={() => router.push("/register")}
          >
            Registrarse
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}
