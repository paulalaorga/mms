"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Heading, Text, Spinner, Alert, AlertIcon } from "@chakra-ui/react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

export default function UserDetailPage() {

  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    if (!id) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        if (!res.ok) throw new Error("No se pudo cargar el usuario");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Error desconocido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <Spinner />;
  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  if (!user)
    return (
      <Alert status="warning">
        <AlertIcon />
        Usuario no encontrado
      </Alert>
    );

  return (
    <Box p={6}>
      <Heading size="lg">Detalles del Usuario</Heading>
      <Text><strong>Nombre:</strong> {user.name || "No disponible"}</Text>
      <Text><strong>Email:</strong> {user.email}</Text>
      <Text><strong>Rol:</strong> {user.role}</Text>
      <Text><strong>Fecha de Registro:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Fecha no disponible"}</Text>
    </Box>
  );
}
