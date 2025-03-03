"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
  Grid,
  GridItem,
  Text,
  VStack,
} from "@chakra-ui/react";

interface User {
  _id: string;
  name: string;
  surname?: string;
  dni?: string;
  phone?: string;
  email: string;
  role: string;
  groupLevel: "Fundamental" | "Avanzado";
  contractSigned: "Sí" | "No"; // ✅ Ahora es un select en lugar de un checkbox
  recoveryContact?: string;
  createdAt?: string;
  isConfirmed?: boolean;
  isPatient?: boolean;
  groupProgramPaid?: boolean;
  individualProgram?: boolean;
  nextSessionDate?: string | null;
  provider?: string;
  programs?: {
    _id: string;
    programId: { name: string };
    purchaseDate: string;
  }[];
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState(""); // Nuevo estado para la contraseña


  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        const data = await res.json();

        console.log("🔍 Datos del usuario:", JSON.stringify(data, null, 2));

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
  }, [id]);


  const handleDeleteProgram = async (programId: string) => {
    if (!user) return;

    try {
      const res = await fetch(`/api/admin/users/${id}/programs/${programId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar el programa");

      setUser((prevUser) =>
        prevUser
          ? { ...prevUser, programs: prevUser?.programs?.filter((p) => p._id !== programId) }
          : prevUser
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error inesperado al eliminar el programa");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!user) return;
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
  
    try {
      const updatedUser = {
        ...user,
        isPatient: Boolean(user.isPatient), // 📌 Asegurar booleano
        contractSigned: user.contractSigned === "Sí" || user.contractSigned === "No"
          ? user.contractSigned
          : user.contractSigned === true
          ? "Sí"
          : "No", // 📌 Convertir a "Sí"/"No" si es booleano
      };
  
      // 📌 Enviar la solicitud al backend
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
  
      const responseData = await res.json();
      console.log("🔍 Respuesta de la API:", responseData);
  
      if (!res.ok) throw new Error(responseData.error || "Error al actualizar el usuario");
  
      console.log("✅ Usuario actualizado");
      setNewPassword(""); // Limpiar campo de contraseña después de guardar
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
      <Box display="flex" flexDirection={{ base: "column", md: "row" }} justifyContent="space-around">
      <Heading m={4} size="lg" mb={4}>Detalles del Usuario</Heading>
      <Button colorScheme="gray" onClick={() => router.push("/admin/users")}>
        ← Volver a la lista de usuarios
      </Button>
      </Box>

      {/* Grid para organizar en dos columnas */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
        <GridItem>
          <FormControl>
            <FormLabel>Nombre</FormLabel>
            <Input name="name" value={user.name} onChange={handleChange} />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Apellidos</FormLabel>
            <Input name="surname" value={user.surname || ""} onChange={handleChange} />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input name="email" value={user.email} onChange={handleChange} />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>DNI/Pasaporte</FormLabel>
            <Input name="dni" value={user.dni || ""} onChange={handleChange} />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Teléfono</FormLabel>
            <Input name="phone" value={user.phone || ""} onChange={handleChange} />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Nivel de Grupo</FormLabel>
            <Select name="groupLevel" value={user.groupLevel} onChange={handleChange}>
              <option value="Fundamental">Fundamental</option>
              <option value="Avanzado">Avanzado</option>
              <option value="VIP">VIP</option>
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Rol</FormLabel>
            <Select name="role" value={user.role} onChange={handleChange}>
              <option value="user">Usuario</option>
              <option value="admin">Admin</option>
              <option value="therapist">Terapeuta</option>
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Contrato firmado</FormLabel>
            <Select name="contractSigned" value={user.contractSigned} onChange={handleChange}>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>¿Es paciente?</FormLabel>
            <Select name="isPatient" value={user.isPatient ? "Sí" : "No"} onChange={handleChange}>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Fecha de Registro</FormLabel>
            <Input value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "No disponible"} isDisabled />
          </FormControl>
        </GridItem>

        <GridItem>
        <FormControl>
          <FormLabel>Nueva Contraseña</FormLabel>
          <Input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Escribe una nueva contraseña"
          />
        </FormControl>
      </GridItem>

    <GridItem>
      <Heading size="md" mt={6} mb={2}>Programas Activos</Heading>
      {user.programs && user.programs.length > 0 ? (
        <VStack spacing={4} align="stretch">
          {user.programs.map(({ _id, programId, purchaseDate }) => (
            <Box key={_id} p={4} borderWidth="1px" borderRadius="md">
              <Text fontSize="lg" fontWeight="bold">{programId.name}</Text>
              <Text fontSize="sm" color="gray.500">Fecha de compra: {new Date(purchaseDate).toLocaleDateString()}</Text>
              <Button
                colorScheme="red"
                size="sm"
                mt={2}
                onClick={() => handleDeleteProgram(_id)}
              >
                Eliminar Programa
              </Button>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text color="gray.500">Este usuario no tiene programas activos.</Text>
      )}
    </GridItem>
      </Grid>

      <Button mt={6} colorScheme="blue" onClick={handleSave} isLoading={saving}>
        Guardar cambios
      </Button>
    </Box>
  );
}
