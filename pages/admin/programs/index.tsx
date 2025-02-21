"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  Stack,
  FormLabel,
  Select,
  useToast,
} from "@chakra-ui/react";

type PaymentType = "subscription" | "one-time";
type GroupLevel = "Fundamental" | "Avanzado" | "VIP";

type ProgramType = {
  _id?: string;
  name: string;
  description: string;
  groupLevel: GroupLevel;
  price?: number | undefined; // ✅ Ahora permite `undefined`, pero no `null`
  paymentType: PaymentType;
  billingFrequency?: number | undefined; // ✅ Ahora permite `undefined`, pero no `null`
  billingCycles?: number | undefined;
};

export default function AdminPrograms() {
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [form, setForm] = useState<ProgramType>({
    name: "",
    description: "",
    groupLevel: "Fundamental",
    price: undefined, // ✅ Usamos `undefined` en lugar de `null`
    paymentType: "subscription",
    billingFrequency: undefined, // ✅ Usamos `undefined` en lugar de `null`
    billingCycles: undefined,
  });

  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetch("/api/admin/programs")
      .then((res) => res.json())
      .then(setPrograms)
      .catch(() =>
        toast({ title: "Error al cargar los programas", status: "error" })
      );
  }, [toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "billingCycles" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    const method = isEditing ? "PUT" : "POST";
    const body = JSON.stringify({
      name: form.name,
      description: form.description,
      groupLevel: form.groupLevel,
      price: form.price !== undefined ? form.price : 0,
      paymentType: form.paymentType,
      billingFrequency: form.billingFrequency !== undefined ? form.billingFrequency : null,
      billingCycles: form.billingCycles !== undefined ? form.billingCycles : null,
    });
  
    console.log("🔍 Enviando datos a la API:", body);
  
    const response = await fetch("/api/admin/programs", {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });
  
    const responseData = await response.json().catch(() => null);
  
    if (response.ok) {
      toast({
        title: isEditing ? "Programa actualizado" : "Programa creado",
        status: "success",
      });
      setIsEditing(false);
      setForm({
        name: "",
        description: "",
        groupLevel: "Fundamental",
        price: undefined,
        paymentType: "subscription",
        billingFrequency: undefined,
        billingCycles: undefined,
      });
      fetch("/api/admin/programs")
        .then((res) => res.json())
        .then(setPrograms);
    } else {
      console.error("❌ Error en la API:", response.status, responseData);
      toast({ title: `Error al guardar: ${responseData?.error || "Desconocido"}`, status: "error" });
    }
  };  

  const handleEdit = (program: ProgramType) => {
    setForm(program);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    const response = await fetch("/api/admin/programs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      toast({ title: "Programa eliminado", status: "success" });
      setPrograms(programs.filter((p) => p._id && p._id !== id));
    } else {
      toast({ title: "Error al eliminar el programa", status: "error" });
    }
  };

  return (
    <Container maxW="container.lg">
      <Heading as="h1" size="xl" my={6}>
        Administrar Programas
      </Heading>

      <Stack spacing={4} mb={6}>
        <FormLabel>Nombre del Programa</FormLabel>
        <Input name="name" value={form.name} onChange={handleInputChange} />

        <FormLabel>Descripción del Programa</FormLabel>
        <Input
          name="description"
          value={form.description}
          onChange={handleInputChange}
        />

        <FormLabel>Nivel de Grupos</FormLabel>
        <Select
          name="groupLevel"
          value={form.groupLevel}
          onChange={handleInputChange}
        >
          <option value="Fundamental">Fundamental</option>
          <option value="Avanzado">Avanzado</option>
          <option value="VIP">VIP</option>
        </Select>

        <FormLabel>Tipo de Pago</FormLabel>
        <Select
          name="paymentType"
          value={form.paymentType}
          onChange={handleInputChange}
        >
          <option value="subscription">Suscripción</option>
          <option value="one-time">Pago Único</option>
        </Select>

        {/* Sección de Precio */}
        <>
          <FormLabel>Precio (€)</FormLabel>
          <Input
            type="number"
            name="price"
            value={form.price !== undefined ? form.price : ""}
            onChange={handleInputChange}
          />
        </>

        {/* Solo se muestra si es suscripción */}
        {form.paymentType === "subscription" && (
          <>
            <FormLabel>Frecuencia de Facturación</FormLabel>
            <Select
              name="billingFrequency"
              value={
                form.billingFrequency !== undefined ? form.billingFrequency : ""
              }
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Selecciona una opción
              </option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
              <option value="yearly">Anual</option>
            </Select>

            <FormLabel>Número de Pagos</FormLabel>
            <Input
              type="number"
              name="billingCycles"
              value={form.billingCycles !== undefined ? form.billingCycles : ""}
              onChange={handleInputChange}
            />
          </>
        )}

        <Button colorScheme="teal" onClick={handleSubmit}>
          {isEditing ? "Actualizar Programa" : "Crear Programa"}
        </Button>
      </Stack>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Nivel</Th>
            <Th>Precio</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {programs?.length > 0 ? (
            programs.map((program) => (
              <Tr key={program._id}>
                <Td>{program.name}</Td>
                <Td>{program.groupLevel}</Td>
                <Td>{program.price}€</Td>
                <Td>
                  <Button size="sm" onClick={() => handleEdit(program)}>
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(program._id!)}
                  >
                    Eliminar
                  </Button>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                No hay programas disponibles.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Container>
  );
}
