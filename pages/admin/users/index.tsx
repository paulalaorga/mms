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
  Link,
  Flex,
  Input,
} from "@chakra-ui/react";
import { IUser } from "@/models/User";

export default function UsersPage() {


  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("No se pudieron cargar los usuarios");
        const data = await res.json();
        setUsers(data);
        setFilteredUsers(data);
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

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())

    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  return (
    <Box p={6}>
      <Flex justify="space-between" mb={4}>
      <Heading size="lg" mb={4}>Lista de Usuarios</Heading>
      <Input
        type="text"
        placeholder="Buscar usuario por nombre/mail/rol"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        border="1px solid #CBD5E0"
        borderRadius="md"
        p={2}
        w="auto"
        mr={4}
      />
      </Flex>

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
              {filteredUsers.map((user) => (
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
