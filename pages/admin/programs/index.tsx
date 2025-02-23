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

type PricingOption = {
  period: "monthly" | "yearly" | "weekly";
  price: number | null; // ✅ Ahora permite `null`
  billingCycles?: number | null;
};

type ProgramType = {
  _id?: string;
  name: string;
  description: string;
  groupLevel: GroupLevel;
  paymentType: PaymentType;
  billingFrequency?: number | undefined; // ✅ Ahora permite `undefined`, pero no `null`
  billingCycles?: number | undefined;
  pricingOptions?: PricingOption[];
};

export default function AdminPrograms() {
  const [programs, setPrograms] = useState<
    (ProgramType & { userCount?: number })[]
  >([]);
  const [form, setForm] = useState<ProgramType>({
    name: "",
    description: "",
    groupLevel: "Fundamental",
    paymentType: "subscription",
    billingFrequency: undefined, // ✅ Usamos `undefined` en lugar de `null`
    billingCycles: undefined,
  });
  const [pricingOptions, setPricingOptions] = useState<PricingOption[]>([]);

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
      paymentType: form.paymentType,
      billingFrequency:
        form.billingFrequency !== undefined ? form.billingFrequency : null,
      billingCycles:
        form.billingCycles !== undefined ? form.billingCycles : null,
      pricingOptions: pricingOptions, // <-- Se añade este campo
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
        paymentType: "subscription",
        billingFrequency: undefined,
        billingCycles: undefined,
      });
      // Limpiar también las opciones de precio
      setPricingOptions([]);
      fetch("/api/admin/programs")
        .then((res) => res.json())
        .then(setPrograms);
    } else {
      console.error("❌ Error en la API:", response.status, responseData);
      toast({
        title: `Error al guardar: ${responseData?.error || "Desconocido"}`,
        status: "error",
      });
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

        <FormLabel>Nivel de Grupos de Terapia</FormLabel>
        <Select
          name="groupLevel"
          value={form.groupLevel}
          onChange={handleInputChange}
        >
          <option value="Fundamental">Fundamental</option>
          <option value="Avanzado">Avanzado</option>
          <option value="VIP">VIP</option>
        </Select>

        <Stack spacing={4} mb={6}>
          <Heading size="md">Opciones de Precio</Heading>

          {pricingOptions.map((option, index) => (
            <Stack key={index} direction="row" align="center">
              <Select
                value={option.period}
                onChange={(e) => {
                  const newOptions = [...pricingOptions];
                  newOptions[index].period = e.target.value as
                    | "monthly"
                    | "yearly";
                  setPricingOptions(newOptions);
                }}
              >
                <option value="monthly">Mensual</option>
                <option value="yearly">Pago Único</option>
                <option value="weekly">Semanal</option>
              </Select>
              <Input
                type="number"
                placeholder="Precio (€)"
                value={option.price ?? ""}
                onChange={(e) => {
                  const newOptions = [...pricingOptions];
                  newOptions[index].price = Number(e.target.value);
                  setPricingOptions(newOptions);
                }}
              />
              <Input
                type="number"
                placeholder="Ciclos de Facturación"
                value={option.billingCycles ?? ""}
                onChange={(e) => {
                  const newOptions = [...pricingOptions];
                  newOptions[index].billingCycles = Number(e.target.value);
                  setPricingOptions(newOptions);
                }}
              />
            </Stack>
          ))}

          <Button
            onClick={() =>
              setPricingOptions([
                ...pricingOptions,
                { period: "monthly", price: null }, // Valor inicial
              ])
            }
          >
            Agregar Opción de Precio
          </Button>
        </Stack>

        <Button colorScheme="teal" onClick={handleSubmit}>
          {isEditing ? "Actualizar Programa" : "Crear Programa"}
        </Button>
      </Stack>

      <Table variant="simple">
  <Thead>
    <Tr>
      <Th>Nombre</Th>
      <Th>Nivel de Terapia</Th>
      <Th>Opciones de Pago</Th>
      <Th>Usuarios Activos</Th>
      <Th></Th>
    </Tr>
  </Thead>
  <Tbody>
    {programs?.length > 0 ? (
      programs.map((program) => (
        <Tr key={program._id}>
          <Td>{program.name}</Td>
          <Td>{program.groupLevel}</Td>
          <Td>
                {program.pricingOptions && program.pricingOptions.length > 0 ? (
                  program.pricingOptions.map((option, index) => (
                    <div key={index}>
                      <strong>
                        {option.period === "monthly"
                          ? "Mensual"
                          : option.period === "yearly"
                          ? "Anual"
                          : option.period === "weekly"
                          ? "Semanal"
                          : option.period}
                        :
                      </strong>{" "}
                      {option.price}€
                    </div>
                  ))
                ) : (
                  <div>No hay opciones de suscripción configuradas</div>
            )}
          </Td>

          <Td>{program.userCount || 0}</Td>
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
        <Td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
          No hay programas disponibles.
        </Td>
      </Tr>
    )}
  </Tbody>
</Table>

    </Container>
  );
}
