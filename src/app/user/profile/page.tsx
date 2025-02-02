"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  Spinner,
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
  AlertIcon, } from "@chakra-ui/react";

export default function UserProfile() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const loading = session === undefined;

  if (!session) {
    router.push("/login");
    return null;
  }
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(data.message);
    } else {
      setError(data.message);
    }
  };

  if (loading || !session) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
      </Container>
    );
  }
  return (
    <>
      <Container centerContent maxW="md" py="8">
        <Box p={6} borderWidth={1} borderRadius={8} boxShadow="lg">
          <VStack spacing={4}>
            <Heading as="h1" size="lg">
              Mi perfil
            </Heading>
            <Text>Bienvenido: {session.user.name}</Text>
            <Heading size="md">Cambiar contraseña</Heading>
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
            <form onSubmit={handleChangePassword} style={{ width: "100%" }}>
              <FormControl isRequired>
                <FormLabel>Contraseña actual</FormLabel>
                <Input
                  type="password"
                  placeholder="********"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired mt={4}>
              <FormLabel>Nueva Contraseña</FormLabel>
              <Input
                type="password"
                placeholder="********"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                <Input
                  type="password"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </FormControl>

              <Button type="submit" colorScheme="blue">
                Cambiar contraseña
              </Button>
            </form>
          </VStack>
        </Box>
      </Container>

    </>
  );
}
