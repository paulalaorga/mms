"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

interface User {
  _id: string;
  name: string;
  surname?: string;
  dni?: string;
  phone?: string;
  email: string;
  role: string;
  contractSigned?: boolean;
  recoveryContact?: string;
  createdAt?: string;
  isConfirmed?: boolean;
  isPatient?: boolean;
  groupProgramPaid?: boolean;
  individualProgram?: boolean;
  nextSessionDate?: string | null;
  provider?: string;
}

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!router.isReady || !id || typeof id !== "string") return;

    console.log("🔍 Fetching user with ID:", id); // Debugging log

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${id}`);

        if (!res.ok) {
          if (res.status === 404) throw new Error("User Not Found");
          throw new Error("Failed to load user");
        }

        const data = await res.json();
        console.log("✅ User Data:", data);
        setUser(data);
      } catch (error) {
        console.error("❌ Fetch Error:", error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, router.isReady]);

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
        <Text>
          <strong>Nombre:</strong> {user.name || "No disponible"}
        </Text>
        <Text>
          <strong>Apellidos:</strong> {user.surname || "No disponible"}
        </Text>
        <Text>
          <strong>Email:</strong> {user.email}
        </Text>
        <Text>
          <strong>DNI/Pasaporte:</strong> {user.dni || "No disponible"}
        </Text>
        <Text>
          <strong>Teléfono:</strong> {user.phone || "No disponible"}
        </Text>
        <Text>
          <strong>Rol:</strong> {user.role}
        </Text>
        <Text>
          <strong>Estado de Confirmación:</strong>{" "}
          {user.isConfirmed ? "✅ Confirmado" : "❌ No confirmado"}
        </Text>
        <Text>
          <strong>Contrato firmado:</strong>{" "}
          {user.contractSigned ? "✅ Sí" : "❌ No"}
        </Text>
        <Text>
          <strong>¿Es paciente?</strong>{" "}
          {user.isPatient ? "✅ Sí" : "❌ No"}
        </Text>
        <Text>
          <strong>Ha pagado el programa grupal:</strong>{" "}
          {user.groupProgramPaid ? "✅ Sí" : "❌ No"}
        </Text>
        <Text>
          <strong>Tiene un programa individual:</strong>{" "}
          {user.individualProgram ? "✅ Sí" : "❌ No"}
        </Text>
        <Text>
          <strong>Próxima sesión individual:</strong>{" "}
          {user.nextSessionDate
            ? new Date(user.nextSessionDate).toLocaleDateString()
            : "No programada"}
        </Text>
        <Text>
          <strong>Contacto de recuperación:</strong>{" "}
          {user.recoveryContact || "No disponible"}
        </Text>
        <Text>
          <strong>Proveedor de autenticación:</strong>{" "}
          {user.provider || "Correo electrónico"}
        </Text>
        <Text>
          <strong>Fecha de Registro:</strong>{" "}
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "Fecha no disponible"}
        </Text>
      </Box>
    );
  }
