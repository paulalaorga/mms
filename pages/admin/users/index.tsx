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
import { IUser } from "../../../models/User";

export default function UsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [patientFilter, setPatientFilter] = useState<boolean | null>(null);

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
    let filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (patientFilter !== null) {
      filtered = filtered.filter(user => user.isPatient === patientFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, users, roleFilter, patientFilter]);

  // 📌 Función para ordenar usuarios
  const handleSort = (field: keyof IUser) => {
    if (field === "role") {
      // Si se hace click en la columna de "Rol", aplicar filtrado en lugar de ordenación
      const newFilter = roleFilter === "user" ? "admin" : roleFilter === "admin" ? "therapist" : roleFilter === "therapist" ? null : "user";
      setRoleFilter(newFilter);
      
      return;
    }

    if (field === "isPatient") {
      // Si se hace click en la columna de "Paciente", aplicar filtrado en lugar de ordenación
      const newFilter = patientFilter === true ? false : patientFilter === false ? null : true;
      setPatientFilter(newFilter);

      return;
    } 

    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      let valueA: string | number | boolean | Date = a[field] ?? "";
      let valueB: string | number | boolean | Date = b[field] ?? "";
    
      // Asegurar que createdAt se ordena correctamente como fecha
      if (field === "createdAt") {
        valueA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        valueB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      }
    
      // Comparación numérica (timestamp) si es fecha
      if (valueA instanceof Date && valueB instanceof Date) {
        return order === "asc"
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime();
      }
    
      // Comparación genérica para otros tipos de datos
      if (valueA < valueB) return order === "asc" ? -1 : 1;
      if (valueA > valueB) return order === "asc" ? 1 : -1;
      return 0;
    });
    
    
    

    setFilteredUsers(sortedUsers);
  };

  return (
    <Box p={6} maxW="80vw" margin="0 auto">
      {/* Encabezado y Búsqueda */}
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg">Lista de Usuarios</Heading>
        <Input
          type="text"
          placeholder="Buscar usuario por nombre/mail/rol"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          border="1px solid #CBD5E0"
          borderRadius="md"
          p={2}
          w="300px"
        />
      </Flex>

      {/* Carga y Errores */}
      {loading && <Spinner size="xl" />}
      {error && (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* Tabla de Usuarios */}
      {!loading && !error && (
        <TableContainer maxW="100%" overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th onClick={() => handleSort("name")} cursor="pointer">
                  Nombre {sortField === "name" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
                </Th>
                <Th onClick={() => handleSort("surname")} cursor="pointer">
                  Apellido {sortField === "surname" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
                </Th>
                <Th onClick={() => handleSort("email")} cursor="pointer">
                  Email {sortField === "email" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
                </Th>
                <Th onClick={() => handleSort("isPatient")} cursor="pointer">
                  Paciente {patientFilter ? `(${patientFilter})` : ""}
                </Th>
                <Th onClick={() => handleSort("role")} cursor="pointer">
                  Rol {roleFilter ? `(${roleFilter})` : ""}
                </Th>
                <Th onClick={() => handleSort("createdAt")} cursor="pointer">
                  Fecha de Registro {sortField === "createdAt" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
                </Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredUsers.map((user) => (
                <Tr key={String(user._id)}>
                  <Td>{user.name || "Sin nombre"}</Td>
                  <Td>{user.surname || "Sin Apellido"}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.isPatient ? "Si" : "No"}</Td>
                  <Td>{user.role}</Td>
                  <Td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "No disponible"}</Td>
                  <Td>
                    <Link href={`/admin/users/${user._id}`} color="blue.500" textDecoration="underline">
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
