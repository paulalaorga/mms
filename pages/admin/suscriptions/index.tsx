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
  Spinner,
  Box,
  Text,
  Button,
} from "@chakra-ui/react";

interface Subscription {
  id: string;
  user: string;
  status: string;
  startDate: string;
  endDate: string;
  plan: string;
}

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/subscriptions");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al obtener suscripciones");
      } else {
        setSubscriptions(data.subscriptions);
      }
    } catch {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <Container maxW={"container.lg"} mt={10}>
        <Button m={4} alignSelf={"flex-end"} as="a" href="/admin/payment-status" colorScheme="teal">
            Volver a Facturación
        </Button>
      <Heading textAlign={"center"} mb={6}>Administrar Suscripciones</Heading>

      {loading && <Spinner />}
      {error && (
        <Box color="red.500">
          <Text>{error}</Text>
        </Box>
      )}

      {!loading && !error && subscriptions.length === 0 && (
        <Text>No hay suscripciones registradas.</Text>
      )}

      {subscriptions.length > 0 && (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID Suscripción</Th>
              <Th>Usuario</Th>
              <Th>Plan</Th>
              <Th>Estado</Th>
              <Th>Fecha Inicio</Th>
              <Th>Fecha Fin</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {subscriptions.map((sub) => (
              <Tr key={sub.id}>
                <Td>{sub.id}</Td>
                <Td>{sub.user}</Td>
                <Td>{sub.plan}</Td>
                <Td>{sub.status}</Td>
                <Td>{new Date(sub.startDate).toLocaleDateString()}</Td>
                <Td>{new Date(sub.endDate).toLocaleDateString()}</Td>
                <Td>
                  <Button size="sm" colorScheme="teal">
                    Gestionar
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Container>
  );
}
