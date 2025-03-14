import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";

interface PaymentRecord {
  id: string;
  orderId: string;
  programName: string;
  amount: number;
  status: string;
  date: string;
  type: "one-time" | "subscription";
  nextPaymentDate?: string;
}

export default function PaymentHistory() {
  const { data: session } = useSession();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!session?.user) return;
      
      try {
        setLoading(true);
        const res = await fetch("/api/user/payment-history");
        
        if (!res.ok) {
          throw new Error("Error al cargar el historial de pagos");
        }
        
        const data = await res.json();
        setPayments(data.payments || []);
      } catch (error) {
        console.error("Error fetching payment history:", error);
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaymentHistory();
  }, [session]);

  const showPaymentDetails = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    onOpen();
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "active" || statusLower === "paid" || statusLower === "authorized") return "green";
    if (statusLower === "pending") return "yellow";
    if (statusLower === "failed" || statusLower === "cancelled" || statusLower === "expired") return "red";
    return "gray";
  };

  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <Spinner size="lg" />
        <Text mt={2}>Cargando historial de pagos...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  if (payments.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Text>No hay registros de pagos.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={4}>Historial de Pagos</Heading>
      
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Fecha</Th>
              <Th>Programa</Th>
              <Th>Importe</Th>
              <Th>Estado</Th>
              <Th>Tipo</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {payments.map((payment) => (
              <Tr key={payment.id}>
                <Td>{new Date(payment.date).toLocaleDateString()}</Td>
                <Td>{payment.programName}</Td>
                <Td>{payment.amount}€</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </Td>
                <Td>
                  <Badge colorScheme={payment.type === "subscription" ? "purple" : "blue"}>
                    {payment.type === "subscription" ? "Suscripción" : "Pago único"}
                  </Badge>
                </Td>
                <Td>
                  <Button size="xs" onClick={() => showPaymentDetails(payment)}>
                    Detalles
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal de detalles del pago */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalles del Pago</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedPayment && (
              <Box>
                <Flex justifyContent="space-between" mb={2}>
                  <Text fontWeight="bold">Referencia:</Text>
                  <Text>{selectedPayment.orderId}</Text>
                </Flex>
                <Flex justifyContent="space-between" mb={2}>
                  <Text fontWeight="bold">Programa:</Text>
                  <Text>{selectedPayment.programName}</Text>
                </Flex>
                <Flex justifyContent="space-between" mb={2}>
                  <Text fontWeight="bold">Fecha:</Text>
                  <Text>{new Date(selectedPayment.date).toLocaleString()}</Text>
                </Flex>
                <Flex justifyContent="space-between" mb={2}>
                  <Text fontWeight="bold">Importe:</Text>
                  <Text>{selectedPayment.amount}€</Text>
                </Flex>
                <Flex justifyContent="space-between" mb={2}>
                  <Text fontWeight="bold">Estado:</Text>
                  <Badge colorScheme={getStatusColor(selectedPayment.status)}>
                    {selectedPayment.status}
                  </Badge>
                </Flex>
                <Flex justifyContent="space-between" mb={2}>
                  <Text fontWeight="bold">Tipo:</Text>
                  <Badge colorScheme={selectedPayment.type === "subscription" ? "purple" : "blue"}>
                    {selectedPayment.type === "subscription" ? "Suscripción" : "Pago único"}
                  </Badge>
                </Flex>
                {selectedPayment.type === "subscription" && selectedPayment.nextPaymentDate && (
                  <Flex justifyContent="space-between" mb={2}>
                    <Text fontWeight="bold">Próximo pago:</Text>
                    <Text>{new Date(selectedPayment.nextPaymentDate).toLocaleDateString()}</Text>
                  </Flex>
                )}
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}