"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
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
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

export default function AdminProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState(session?.user?.name || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/profile");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <Container centerContent>
        <Spinner size="xl" />
        <Text>Cargando...</Text>
      </Container>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("Perfil actualizado correctamente");
    } else {
      setMessage(data.error || "Error actualizando el perfil");
    }
  };

  return (
    <Container centerContent py={10}>
      <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="lg" w="100%" maxW="md">
        <VStack spacing={4}>
          <Heading size="lg">Perfil de Administrador</Heading>
          <Text>Bienvenido, {session?.user?.name}. Tienes permisos de administrador.</Text>

          <Box w="100%">
            <Text fontWeight="bold">Email:</Text>
            <Text>{session?.user?.email}</Text>
          </Box>

          <Box w="100%">
            <Text fontWeight="bold">Rol:</Text>
            <Text>{session?.user?.role || "Usuario"}</Text>
          </Box>

          <form onSubmit={handleUpdate} style={{ width: "100%" }}>
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Nueva Contraseña</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <Button colorScheme="blue" w="100%" mt={6} type="submit">
              {loading ? "Guardando..." : "Actualizar"}
            </Button>
          </form>

          {message && (
            <Alert status="success">
              <AlertIcon />
              {message}
            </Alert>
          )}

          <Button colorScheme="red" w="100%" mt={4} onClick={() => signOut()}>
            Cerrar sesión
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}
