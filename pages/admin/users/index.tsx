"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Alert,
  AlertIcon,
  Box,
  Heading,
  Link
} from "@chakra-ui/react";
import { IUser } from "@/models/User";

export default function UsersPage() {


  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("No se pudieron cargar los usuarios");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>Lista de Usuarios</Heading>

      {loading && <Spinner size="xl" />}
      {error && (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nombre</Th>
                <Th>Email</Th>
                <Th>Rol</Th>
                <Th>Fecha de Registro</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={String(user._id)}>
                  <Td>{user.name || "Sin nombre"}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.role}</Td>
                  <Td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Fecha no disponible"}</Td>
                  <Td>
                    <Link href={`/admin/users/${user._id}`} style={{ color: "#3182CE", textDecoration: "underline" }}>
                      Ver detalles
                    </Link>
                  </Td>
                  </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
