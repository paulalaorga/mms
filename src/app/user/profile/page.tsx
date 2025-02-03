"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
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
  AlertIcon,
} from "@chakra-ui/react";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export default function UserProfile() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
  
    const fetchUserData = async () => {
      try {
        console.log("🔍 Solicitando datos del usuario...");
        const res = await fetch(`/api/user/profile`);
        console.log("📡 Respuesta recibida:", res.status);
  
        if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
        const data: User = await res.json();
        console.log("✅ Datos del usuario obtenidos:", data);
  
        setUserData(data);
        setName(data.name);
        setPhone(data.phone || "");
      } catch (err) {
        console.error("❌ Error obteniendo datos del usuario:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess("Perfil actualizado correctamente");
    } else {
      setError(data.message || "No se pudo actualizar el perfil");
    }
  };

  if (loading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
      </Container>
    );
  }

  return (
    <Container centerContent maxW="md" py="8">
      <Box p={6} borderWidth={1} borderRadius={8} boxShadow="lg">
        <VStack spacing={4}>
          <Heading as="h1" size="lg">
            Mi perfil
          </Heading>
          <Text>Bienvenido: {session?.user?.name}</Text>

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

          <form onSubmit={handleUpdateProfile} style={{ width: "100%" }}>
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input
                type="text"
                placeholder="Tu nombre"
                value={userData?.name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Teléfono</FormLabel>
              <Input
                type="tel"
                placeholder="Tu teléfono"
                value={userData?.phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormControl>

            <Button type="submit" colorScheme="blue" mt={4}>
              Guardar cambios
            </Button>
          </form>
        </VStack>
      </Box>
    </Container>
  );
}
