"use client";

import React, { useEffect, useState } from "react";
import { Container, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner } from "@chakra-ui/react";

interface Payment {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/payments")
      .then((res) => res.json())
      .then((data) => {
        setPayments(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar pagos:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container maxW="container.lg" mt={10}>
        <Spinner />
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" mt={10}>
      <Heading as="h1" mb={6}>
        Lista de Pagos
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID de Pago</Th>
            <Th>ID de Orden</Th>
            <Th>Monto</Th>
            <Th>Moneda</Th>
            <Th>Estado</Th>
            <Th>Fecha</Th>
          </Tr>
        </Thead>
        <Tbody>
          {payments.map((payment) => (
            <Tr key={payment.paymentId}>
              <Td>{payment.paymentId}</Td>
              <Td>{payment.orderId}</Td>
              <Td>{payment.amount}</Td>
              <Td>{payment.currency}</Td>
              <Td>{payment.status}</Td>
              <Td>{new Date(payment.date).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
}
