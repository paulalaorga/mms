"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Heading,
  Input,
  Button,
  Box,
  Text,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

interface PaymentStatusData {
  payment: {
    amount: string;
    amountDisplay: string;
    amountEur: string;
    amountEurDisplay: string;
    authCode: string;
    bicCode: string;
    cardBrand: string;
    cardCategory: string;
    cardCountry: string;
    cardType: string;
    costumerCountry: string;
    currency: string;
    errorCode: number;
    errorDescription: string;
    issuerBank: string;
    methodId: string;
    operationId: number;
    operationName: string;
    operationType: number;
    order: string;
    originalIp: string;
    pan: string;
    paycometId: string;
    response: string;
    secure: number;
    settlementDate: string;
    state: number;
    stateName: string;
    terminal: number;
    terminalCurrency: string;
    terminalName: string;
    timestamp: string;
    user: string;
  }
}

interface Payment {
  paymentId: string;
  orderId: string;
  status: string;
  amount: number;
  currency: string;
  date: string;
  productDescription: string;
}

// Helper: convierte una fecha en formato "YYYYMMDDHHmmss" a un objeto Date
function parsePaycometDate(dateString: string): Date {
  if (dateString.length !== 14) return new Date(); // fallback
  const year = Number(dateString.substring(0, 4));
  const month = Number(dateString.substring(4, 6)) - 1; // mes 0-indexado
  const day = Number(dateString.substring(6, 8));
  const hours = Number(dateString.substring(8, 10));
  const minutes = Number(dateString.substring(10, 12));
  const seconds = Number(dateString.substring(12, 14));
  return new Date(year, month, day, hours, minutes, seconds);
}

export default function PaymentStatus() {
  // Estado para consulta individual
  const [order, setOrder] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusData | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");

  // Estado para lista completa de pagos
  const [paymentsList, setPaymentsList] = useState<Payment[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [errorList, setErrorList] = useState("");

  // Función para consultar estado individual
  const checkStatus = async () => {
    setLoadingStatus(true);
    setErrorStatus("");
    setPaymentStatus(null);

    try {
      const res = await fetch(`/api/admin/payment-status?order=${order}`);
      const data = await res.json();
      if (!res.ok) {
        setErrorStatus(data.error || "Error desconocido");
      } else {
        setPaymentStatus(data);
      }
    } catch {
      setErrorStatus("Error al conectar con el servidor");
    } finally {
      setLoadingStatus(false);
    }
  };

  // Función para obtener la lista de pagos
  const fetchPaymentsList = async () => {
    setLoadingList(true);
    setErrorList("");
    try {
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      if (!res.ok) {
        setErrorList(data.error || "Error desconocido");
      } else {
        // Se asume que la respuesta es un objeto con { errorCode: 0, operations: [...] }
        const operations = data.operations || [];
        const mappedPayments: Payment[] = operations.map((op: any) => ({
          paymentId: op.paycometId || op.operationId.toString(),
          orderId: op.order,
          status: op.stateName,
          amount: Number(op.amountEur),
          currency: op.currency,
          date: op.timestamp, // O bien: op.settlementDate
          productDescription: op.productDescription,
        }));
        setPaymentsList(mappedPayments);
      }
    } catch {
      setErrorList("Error al conectar con el servidor");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchPaymentsList();
  }, []);

  return (
    <Container ml={0} mt={10}>
      {/* Sección para consultar estado de pago individual */}
      <Heading mb={4}>Consultar Estado de Pago</Heading>
      <Input
        placeholder="Ingresa el número de orden"
        value={order}
        onChange={(e) => setOrder(e.target.value)}
        mb={4}
      />
      <Button onClick={checkStatus} colorScheme="teal" mb={4}>
        Consultar
      </Button>
      {loadingStatus && <Spinner />}
      {errorStatus && (
        <Box color="red.500">
          <Text>{errorStatus}</Text>
        </Box>
      )}
      {paymentStatus &&  (
        <Box mt={4} p={4} borderWidth="1px" borderRadius="md">
          <Text>
            <strong>Paycomet ID:</strong> {paymentStatus.payment.operationId}
          </Text>
          <Text>
            <strong>Estado:</strong> {paymentStatus.payment.stateName}
          </Text>
          <Text>
            <strong>Monto:</strong> {paymentStatus.payment.amountEur}€
          </Text>
          <Text>
            <strong>Moneda:</strong> {paymentStatus.payment.currency}
          </Text>
          <Text>
            <strong>Usuario:</strong> {paymentStatus.payment.user}
          </Text>
          <Text>
            <strong>Fecha del pago:</strong> {parsePaycometDate(paymentStatus.payment.timestamp).toLocaleString()}
          </Text>

        </Box>
      )}

      {/* Sección para mostrar la lista completa de pagos */}
      <Heading mt={10} mb={4} size="lg">
        Lista de Pagos
      </Heading>
      {loadingList && <Spinner />}
      {errorList && (
        <Box color="red.500">
          <Text>{errorList}</Text>
        </Box>
      )}
      {!loadingList && !errorList && paymentsList.length === 0 && (
        <Text>No hay pagos disponibles.</Text>
      )}
      {paymentsList.length > 0 && (
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>ID de Orden</Th>
              <Th>ID de Paycomet</Th>
              <Th>Cantidad</Th>
              <Th>Asunto</Th>
              <Th>Estado</Th>
              <Th>Fecha de Compra</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paymentsList.map((payment) => (
              <Tr key={payment.paymentId}>
                <Td>{payment.orderId}</Td>
                <Td>{payment.paymentId}</Td>
                <Td>{payment.amount}€</Td>
                <Td>{payment.productDescription}</Td>
                <Td>{payment.status}</Td>
                <Td>{parsePaycometDate(payment.date).toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Container>
  );
}
