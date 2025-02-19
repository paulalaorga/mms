"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Heading,
  Input,
  Select,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Switch,
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!router.isReady || !id || typeof id !== "string") return;

    console.log("🔍 Fetching user with ID:", id);

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${id}`);

        if (!res.ok) {
          if (res.status === 404) throw new Error("Usuario no encontrado");
          throw new Error("Error al cargar el usuario");
        }

        const data = await res.json();
        console.log("✅ User Data:", data);
        setUser(data);
      } catch (error) {
        console.error("❌ Fetch Error:", error);
        setError(
          error instanceof Error ? error.message : "Ocurrió un error inesperado"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, router.isReady]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!user) return;
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleToggle = (key: keyof User) => {
    if (!user) return;
    setUser({ ...user, [key]: !user[key] });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!res.ok) throw new Error("Error al actualizar el usuario");

      console.log("✅ Usuario actualizado");
    } catch (error) {
      console.error("❌ Error al guardar:", error);
    } finally {
      setSaving(false);
    }
  };

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
      <Heading size="lg" mb={4}>Detalles del Usuario</Heading>

      <FormControl>
        <FormLabel>Nombre</FormLabel>
        <Input name="name" value={user.name} onChange={handleChange} />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Apellidos</FormLabel>
        <Input name="surname" value={user.surname || ""} onChange={handleChange} />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Email</FormLabel>
        <Input name="email" value={user.email} isDisabled />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>DNI/Pasaporte</FormLabel>
        <Input name="dni" value={user.dni || ""} onChange={handleChange} />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Teléfono</FormLabel>
        <Input name="phone" value={user.phone || ""} onChange={handleChange} />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Rol</FormLabel>
        <Select name="role" value={user.role} onChange={handleChange}>
          <option value="user">Usuario</option>
          <option value="admin">Admin</option>
          <option value="therapist">Terapeuta</option>
        </Select>
      </FormControl>

      <FormControl display="flex" alignItems="center" mt={4}>
        <FormLabel mb="0">Confirmado</FormLabel>
        <Switch
          isChecked={user.isConfirmed}
          onChange={() => handleToggle("isConfirmed")}
        />
      </FormControl>

      <FormControl display="flex" alignItems="center" mt={4}>
        <FormLabel mb="0">Contrato firmado</FormLabel>
        <Switch
          isChecked={user.contractSigned}
          onChange={() => handleToggle("contractSigned")}
        />
      </FormControl>

      <FormControl display="flex" alignItems="center" mt={4}>
        <FormLabel mb="0">¿Es paciente?</FormLabel>
        <Switch isChecked={user.isPatient} onChange={() => handleToggle("isPatient")} />
      </FormControl>

      <FormControl display="flex" alignItems="center" mt={4}>
        <FormLabel mb="0">Ha pagado el programa grupal</FormLabel>
        <Switch
          isChecked={user.groupProgramPaid}
          onChange={() => handleToggle("groupProgramPaid")}
        />
      </FormControl>

      <FormControl display="flex" alignItems="center" mt={4}>
        <FormLabel mb="0">Tiene un programa individual</FormLabel>
        <Switch
          isChecked={user.individualProgram}
          onChange={() => handleToggle("individualProgram")}
        />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Próxima sesión individual</FormLabel>
        <Input
          type="date"
          name="nextSessionDate"
          value={user.nextSessionDate || ""}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Contacto de recuperación</FormLabel>
        <Input
          name="recoveryContact"
          value={user.recoveryContact || ""}
          onChange={handleChange}
        />
      </FormControl>

      <Button mt={6} colorScheme="blue" onClick={handleSave} isLoading={saving}>
        Guardar cambios
      </Button>
    </Box>
  );
}
