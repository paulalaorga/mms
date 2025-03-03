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
  Checkbox,
} from "@chakra-ui/react";

type GroupLevel = "Fundamental" | "Avanzado";

type PaymentOption = {
  type: "one-time" | "subscription";
  price: number | null;
  subscriptionDetails?: {
    duration: number;
    renewalPeriod: "monthly" | "yearly";
  };
};

type ProgramType = {
  _id?: string;
  programId?: string; // ✅ Ahora lo incluimos en el formulario
  programName: string;
  description: string;
  groupLevel: GroupLevel;
  paymentOptions: PaymentOption[];
  hasIndividualSessions?: boolean;
  individualSessionQuantity?: number | null;
};

export default function AdminPrograms() {
  const [programs, setPrograms] = useState<
    (ProgramType & { userCount?: number })[]
  >([]);
  const [form, setForm] = useState<ProgramType>({
    programName: "",
    description: "",
    groupLevel: "Fundamental",
    paymentOptions: [],
    hasIndividualSessions: false,
    individualSessionQuantity: null,
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
        value === ""
          ? null
          : ["individualSessionQuantity"].includes(name)
            ? Number(value)
            : value,
    }));
  };

  const handleAddPaymentOption = () => {
    setForm((prev) => ({
      ...prev,
      paymentOptions: [
        ...prev.paymentOptions,
        { type: "one-time", price: null },
      ],
    }));
  };

  const handleRemovePaymentOption = (index: number) => {
    setForm((prev) => ({
      ...prev,
      paymentOptions: prev.paymentOptions.filter((_, i) => i !== index),
    }));
  };

  const handlePaymentOptionChange = (
    index: number,
    field: keyof PaymentOption,
    value: string | number
  ) => {
    setForm((prev) => {
      const newPaymentOptions = [...prev.paymentOptions];
      if (field === "subscriptionDetails") {
        newPaymentOptions[index].subscriptionDetails = {
          duration: Number(value),
          renewalPeriod: "monthly",
        };
      } else if (field === "type") {
        newPaymentOptions[index].type = value as "one-time" | "subscription";
      } else if (field === "price") {
        newPaymentOptions[index].price = value as number;
      }
      return { ...prev, paymentOptions: newPaymentOptions };
    });
  };

  const handleSubmit = async () => {
    const method = isEditing ? "PUT" : "POST";
    const body = JSON.stringify({
      programId: form.programId || `prog_${Date.now()}`, // ✅ Generar un programId si no se proporciona
      programName: form.programName,
      description: form.description,
      groupLevel: form.groupLevel,
      paymentOptions: form.paymentOptions,
      hasIndividualSessions: form.hasIndividualSessions,
      individualSessionQuantity: form.hasIndividualSessions
        ? form.individualSessionQuantity
        : null,
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
        programName: "",
        description: "",
        groupLevel: "Fundamental",
        paymentOptions: [],
        hasIndividualSessions: false,
        individualSessionQuantity: null,
      });
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

  const handleDelete = async (_id: string) => {
    const response = await fetch("/api/admin/programs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: _id }),
    });

    if (response.ok) {
      toast({ title: "Programa eliminado", status: "success" });
      setPrograms(programs.filter((p) => p._id !== _id));
    } else {
      toast({ title: "Error al eliminar el programa", status: "error" });
    }
  };

  return (
    <Container maxW="container.lg">
      <Heading as="h1" size="xl" my={6} textAlign={"center"}>
        Administrar Programas
      </Heading>

      <Stack spacing={4} mb={6}>
        <FormLabel>Nombre del Programa</FormLabel>
        <Input
          name="programName"
          value={form.programName}
          onChange={handleInputChange}
        />

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
        </Select>

        <FormLabel>Opciones de Pago</FormLabel>
        {form.paymentOptions.map((option, index) => (
          <Stack key={index} direction="row" align="center">
            <Select
              value={option.type}
              onChange={(e) =>
                handlePaymentOptionChange(index, "type", e.target.value)
              }
            >
              <option value="one-time">Pago Único</option>
              <option value="subscription">Suscripción</option>
            </Select>
            <Input
              type="number"
              placeholder="Precio (€)"
              value={option.price ?? ""}
              onChange={(e) =>
                handlePaymentOptionChange(
                  index,
                  "price",
                  Number(e.target.value)
                )
              }
            />
            {option.type === "subscription" && (
              <Input
                type="number"
                placeholder="Duración (meses)"
                value={option.subscriptionDetails?.duration ?? ""}
                onChange={(e) =>
                  handlePaymentOptionChange(
                    index,
                    "subscriptionDetails",
                    Number(e.target.value)
                  )
                }
              />
            )}
            <Button
              colorScheme="red"
              onClick={() => handleRemovePaymentOption(index)}
            >
              Eliminar
            </Button>
          </Stack>
        ))}
        <Button colorScheme="blue" onClick={handleAddPaymentOption}>
          Agregar Opción de Pago
        </Button>

        <FormLabel>Terapias Individuales</FormLabel>
        <Checkbox
          isChecked={form.hasIndividualSessions}
          onChange={(e) =>
            setForm({ ...form, hasIndividualSessions: e.target.checked })
          }
        >
          Incluir sesiones individuales
        </Checkbox>

        {form.hasIndividualSessions && (
          <>
            <FormLabel>Cantidad de Terapias Individuales</FormLabel>
            <Input
              name="individualSessionQuantity"
              type="number"
              value={form.individualSessionQuantity ?? ""}
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
            <Th>Nivel de Terapia</Th>
            <Th>Sesiones Individuales</Th>
            <Th>Opciones de Pago</Th>
            <Th>Usuarios Activos</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {programs?.length > 0 ? (
            programs.map((program) => (
              <Tr key={program.programId}>
                <Td>{program.programName}</Td>
                <Td>{program.groupLevel}</Td>
                <Td>
                  {program.hasIndividualSessions
                    ? program.individualSessionQuantity
                    : "No"}
                </Td>
                <Td>
                  {Array.isArray(program.paymentOptions) &&
                  program.paymentOptions.length > 0 ? (
                    program.paymentOptions.map((option, index) => (
                      <div key={index}>
                        <strong>
                          {option.type === "one-time"
                            ? "Pago Único"
                            : "Suscripción"}
                          :
                        </strong>{" "}
                        {option.price}€
                        {option.type === "subscription" &&
                          option.subscriptionDetails && (
                            <> / {option.subscriptionDetails.duration} meses </>
                          )}
                      </div>
                    ))
                  ) : (
                    <div>No hay opciones de pago configuradas</div>
                  )}
                </Td>
                <Td>{program.userCount || 0}</Td>
                <Td>
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
              <Td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                No hay programas disponibles.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Container>
  );
}
