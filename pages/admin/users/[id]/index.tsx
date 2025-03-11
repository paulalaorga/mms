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
import { IUser } from "@/models/User";



export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState(""); // Nuevo estado para la contraseña
  const [programId, setProgramId] = useState("");
  const [programName, setProgramName] = useState("");
  const [programDescription, setProgramDescription] = useState("");

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        const data = await res.json();

        console.log("🔍 Datos del usuario:", data);
        if (!data || Object.keys(data).length === 0) {
          throw new Error("Usuario no encontrado");
        } else { 

        setUser(data);
        }
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

  const handleAddProgram = async () => {
    if (!id || !programId || !programName) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/users/${id}/purchases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programId, programName, description: programDescription }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al agregar el programa");

      setUser(data.user);
      setProgramId("");
      setProgramName("");
      setProgramDescription("");
    } catch (error) {
      console.error("❌ Error al agregar programa:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProgram = async (purchaseId: string) => {
    if (!id || !purchaseId) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/users/[id]/purchases`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al eliminar el programa");
      setUser(data.user);
    } catch (error) {
      console.error("❌ Error al eliminar programa:", error);
    } finally {
      setSaving(false);
    }
  };
 

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!user) return;
    setUser({
      ...user,
      [e.target.name]: e.target.value
    } as IUser);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const updatedUser = {
        ...user,
        isPatient: Boolean(user.isPatient), // 📌 Asegurar booleano
        contractSigned:
          typeof user.contractSigned === 'string'
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

      if (!res.ok)
        throw new Error(responseData.error || "Error al actualizar el usuario");

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
      <Box
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        justifyContent="space-around"
      >
        <Heading m={4} size="lg" mb={4}>
          Detalles del Usuario
        </Heading>
        <Button colorScheme="gray" onClick={() => router.push("/admin/users")}>
          ← Volver a la lista de usuarios
        </Button>
      </Box>

      {/* Grid para organizar en dos columnas */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
        <GridItem>
          <FormControl>
                      <FormLabel htmlFor="name">
                        Nombre:
                      </FormLabel>
                      <Input
                        id="name"
                        placeholder="Nombre"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        autoComplete="given-name"
                      />
                    </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Apellidos</FormLabel>
            <Input
              name="surname"
              value={user.surname || ""}
              onChange={handleChange}
            />
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
            <Input
              name="phone"
              value={user.phone || ""}
              onChange={handleChange}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Nivel de Grupo</FormLabel>
            <Select
              name="groupLevel"
              value={user.groupLevel}
              onChange={handleChange}
            >
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
            <Select
              name="contractSigned"
              value={user.contractSigned ? "Sí" : "No"}
              onChange={handleChange}
            >
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>¿Es paciente?</FormLabel>
            <Select
              name="isPatient"
              value={user.isPatient ? "Sí" : "No"}
              onChange={handleChange}
            >
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Fecha de Registro</FormLabel>
            <Input
              value={
                user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "No disponible"
              }
              isDisabled
            />
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
        <Box p={6}>

      <VStack align="start" spacing={4}>
        {/* Mostrar programas comprados */}
        <FormControl>
          <FormLabel>Programas Comprados</FormLabel>
          {(user.purchases || []).length > 0 ? (
            (user.purchases || []).map((purchase) => (
              <Box key={purchase.purchaseId.toString()} p={2} borderWidth={1} borderRadius="md">
                <Text><strong>{purchase.purchaseType}</strong></Text>
                <Button size="sm" colorScheme="red" onClick={() => handleDeleteProgram(purchase.purchaseId.toString())}>
                  Eliminar
                </Button>
              </Box>
            ))
          ) : (
            <Text>No tiene programas comprados</Text>
          )}
        </FormControl>

        {/* Agregar nuevo programa */}
        <FormControl>
          <FormLabel>Agregar nuevo programa</FormLabel>
          <Input placeholder="ID del Programa" value={programId} onChange={(e) => setProgramId(e.target.value)} />
          <Input placeholder="Nombre del Programa" value={programName} onChange={(e) => setProgramName(e.target.value)} />
          <Input placeholder="Descripción del Programa" value={programDescription} onChange={(e) => setProgramDescription(e.target.value)} />
          <Button colorScheme="blue" onClick={handleAddProgram} isLoading={saving}>
            Agregar Programa
          </Button>
        </FormControl>
      </VStack>
    </Box>
        
      </Grid>

      <Button mt={6} colorScheme="blue" onClick={handleSave} isLoading={saving}>
        Guardar cambios
      </Button>
    </Box>
  );
}
