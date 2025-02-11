"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Heading,
  FormControl,
  FormLabel,
  Checkbox,
  AlertIcon,
  VStack,
  Container,
  Alert,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Text,
  Link
} from "@chakra-ui/react";
import Input from "@/components/ui/Input";
import MyButton from "@/components/ui/Button";

export default function UserProfile() {
  const { data: session, update } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Estados para los datos del usuario
  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    email: "",
    dni: "",
    phone: "",
    contractSigned: false,
    recoveryContact: "",
  });

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  // Cargar datos del usuario desde el backend
  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Error al cargar los datos del perfil.");

        const data = await res.json();
        console.log("✅ Datos del usuario recibidos:", data);

        const userData = data.userData || {}; // Acceder a la clave correcta

        setUserData({
          name: userData.name || "",
          surname: userData.surname || "",
          email: userData.email || "",
          dni: userData.dni || "",
          phone: userData.phone || "",
          contractSigned: userData.contractSigned ?? false,
          recoveryContact: userData.recoveryContact || "",
        });

        setIsGoogleUser(data.message?.includes("Google")); // Detectar si es usuario de Google
      } catch {
        setErrorMessage("Error al cargar los datos del perfil.");
      }
    };

    fetchUserData();
  }, [session]);

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Guardar cambios en el perfil
  const handleSave = async () => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!isGoogleUser && !password) {
      setErrorMessage("Debes ingresar tu contraseña actual.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userData,
          currentPassword: isGoogleUser ? undefined : password, // Si es Google, no manda password
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar perfil.");

      await update(); // Actualizar sesión en NextAuth
      setSuccessMessage("Perfil actualizado correctamente.");
    } catch {
      setErrorMessage("Hubo un problema al actualizar tu perfil.");
    } finally {
      setLoading(false);
    }
  };

  // Guardar nueva contraseña
  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }), // ✅ Enviar la nueva contraseña ingresada
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al cambiar la contraseña.");

      setSuccessMessage("Contraseña actualizada correctamente.");
      setNewPassword("");
      setConfirmNewPassword("");
      onClose(); // Cierra el modal
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al actualizar la contraseña.";
      setErrorMessage(message);
    }
  };

  return (
    <>
      <Container maxW="container.md" py={10}>
        <Heading textAlign={"center"} size="lg" mb={6}>
          Tus datos de Usuario
        </Heading>

        {successMessage && (
          <Alert status="success" mb={4}>
            <AlertIcon />
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}

        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>
              Nombre actual:{" "}
              {!userData.name && (
                <Text display="inline" color="red">
                  Faltan datos
                </Text>
              )}
            </FormLabel>
            <Input
              placeholder="Nombre"
              name="name"
              value={userData.name}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>
              Apellidos actuales:{"  "}
              {!userData.surname &&  (
                <Text display="inline" color="red">
                  Faltan datos
                </Text>
              )}
            </FormLabel>
            <Input
              placeholder="Apellidos"
              name="surname"
              value={userData.surname}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isReadOnly>
            <FormLabel>Email registrado:</FormLabel>
            <Input value={userData.email} isDisabled />
          </FormControl>

          <FormControl>
            <FormLabel>
              DNI/Pasaporte actual:{" "}
              {!userData.dni && (
                <Text display="inline" color="red">
                  Faltan datos
                </Text>
              )}
            </FormLabel>
            <Input
              placeholder="DNI/Pasaporte"
              name="dni"
              value={userData.dni}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>
              Número de Teléfono actual:{" "}
              {!userData.phone && (
                <Text display="inline" color="red">
                  Faltan datos
                </Text>
              )}
            </FormLabel>
            <Input
              placeholder="Teléfono"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <Checkbox
              name="contractSigned"
              isChecked={userData.contractSigned}
              onChange={handleChange}
              mr={2}
            />
            <Link href="/contrato.pdf" mb="0">Contrato Terapéutico Firmado</Link>
          </FormControl>

          <FormControl>
            <FormLabel>
              Contacto de Cómplice de Recuperación actual:{" "}
              {userData.recoveryContact}
            </FormLabel>
            <Input
              placeholder="Contacto de recuperación"
              name="recoveryContact"
              value={userData.recoveryContact}
              onChange={handleChange}
            />
          </FormControl>

          {!isGoogleUser && (
            <FormControl>
              <FormLabel>Contraseña Actual</FormLabel>
              <Input
                type="password"
                placeholder="Contraseña actual"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          )}

          <MyButton colorScheme="blue" isLoading={loading} onClick={handleSave}>
            Guardar Cambios
          </MyButton>

          <MyButton colorScheme="orange" onClick={onOpen}>
            Cambiar Contraseña
          </MyButton>
        </VStack>

        {/* Modal para cambiar contraseña */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Cambiar Contraseña</ModalHeader>
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Nueva Contraseña</FormLabel>
                <Input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <Input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <MyButton colorScheme="green" onClick={handleChangePassword}>
                Guardar
              </MyButton>
              <MyButton ml={3} onClick={onClose}>
                Cancelar
              </MyButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </>
  );
}
