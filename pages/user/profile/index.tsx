"use client";

import { useState, useEffect, useCallback } from "react";
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
  Link,
  Text,
} from "@chakra-ui/react";
import Input from "@/components/ui/Input";
import MyButton from "@/components/ui/Button";

interface UserData {
  name?: string;
  surname?: string;
  dni?: string;
  phone?: string;
  recoveryContact?: string;
  contractSigned?: boolean;
  email?: string;
}

export default function UserProfile() {
  const { data: session, update } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [userData, setUserData] = useState<UserData>({
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

  const [missingFields, setMissingFields] = useState<string[]>([]);

  const checkMissingFields = useCallback((data: UserData) => {
    const fields: (keyof UserData)[] = [
      "name",
      "surname",
      "dni",
      "phone",
      "recoveryContact",
    ];
    const emptyFields = fields.filter(
      (field) => !data[field] || data[field] === ""
    );
    setMissingFields(emptyFields);
  }, []);

  // 🔹 Cargar datos del usuario desde la API
  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Error al cargar los datos del perfil.");

        const data = await res.json();

        if (!data || !data.userData) {
          throw new Error("❌ userData no existe en la respuesta de la API.");
        }

        const userData = data.userData;

        setUserData({
          name: userData.name || "",
          surname: userData.surname || "",
          email: userData.email || "",
          dni: userData.dni || "",
          phone: userData.phone || "",
          contractSigned: userData.contractSigned ?? false,
          recoveryContact: userData.recoveryContact || "",
        });

        setIsGoogleUser(session.user.provider === "google");

        // 🔹 Comprobar si hay datos faltantes
        checkMissingFields(userData);
      } catch {
        setErrorMessage("Error al cargar los datos del perfil.");
      }
    };

    fetchUserData();
  }, [session, checkMissingFields]);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Error al cargar los datos del perfil.");

        const data = await res.json();
        if (!data || !data.userData) {
          throw new Error("❌ userData no existe en la respuesta de la API.");
        }

        const userData = data.userData;

        setUserData({
          name: userData.name || "",
          surname: userData.surname || "",
          email: userData.email || "",
          dni: userData.dni || "",
          phone: userData.phone || "",
          contractSigned: userData.contractSigned ?? false,
          recoveryContact: userData.recoveryContact || "",
        });

        setIsGoogleUser(session.user.provider === "google");

        // 🔹 Comprobar si hay datos faltantes
        checkMissingFields(userData);
      } catch {
        setErrorMessage("Error al cargar los datos del perfil.");
      }
    };

    fetchUserData();
  }, [session, checkMissingFields]);

  // 🔹 Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          newPassword,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al cambiar la contraseña.");
      }

      setSuccessMessage("Contraseña cambiada correctamente.");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch {
      setErrorMessage("Hubo un problema al cambiar la contraseña.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  // 🔹 Guardar cambios en el perfil
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
        credentials: "include",
        body: JSON.stringify({
          ...userData,
          currentPassword: isGoogleUser ? undefined : password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al actualizar perfil.");
      }

      await update();
      setSuccessMessage("Perfil actualizado correctamente.");
      checkMissingFields(userData); // Vuelve a verificar si aún hay campos vacíos
    } catch {
      setErrorMessage("Hubo un problema al actualizar tu perfil.");
    } finally {
      setLoading(false);
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

        {missingFields.length > 0 && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            <Text>Faltan datos por completar, rellena los campos en rojo</Text>
          </Alert>
        )}

        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={missingFields.includes("name")}>
            <FormLabel htmlFor="name">
              Nombre:
              {missingFields.includes("name") && (
                <Text color="red.500" ml={2} display={"inline"}>
                  Rellena estos datos debajo
                </Text>
              )}
            </FormLabel>
            <Input
              id="name"
              placeholder="Nombre"
              name="name"
              value={userData.name}
              onChange={handleChange}
              autoComplete="given-name"
            />
          </FormControl>

          <FormControl isInvalid={missingFields.includes("surname")}>
            <FormLabel htmlFor="surname">
              Apellidos:
              {missingFields.includes("surname") && (
                <Text color="red.500" ml={2} display={"inline"}>
                  Rellena estos datos debajo
                </Text>
              )}
            </FormLabel>
            <Input
              id="surname"
              placeholder="Apellidos"
              name="surname"
              value={userData.surname}
              onChange={handleChange}
              autoComplete="family-name"
            />
          </FormControl>

          <FormControl isReadOnly>
            <FormLabel htmlFor="email">Email registrado:</FormLabel>
            <Input
              id="email"
              name="email"
              value={userData.email}
              isDisabled
              autoComplete="email"
            />
          </FormControl>

          <FormControl isInvalid={missingFields.includes("dni")}>
            <FormLabel htmlFor="dni">
              DNI/Pasaporte:
              {missingFields.includes("dni") && (
                <Text color="red.500" ml={2} display={"inline"}>
                  Rellena estos datos debajo
                </Text>
              )}
            </FormLabel>
            <Input
              id="dni"
              placeholder="DNI/Pasaporte"
              name="dni"
              value={userData.dni}
              onChange={handleChange}
              autoComplete="off"
            />
          </FormControl>

          <FormControl isInvalid={missingFields.includes("phone")}>
            <FormLabel htmlFor="phone">
              Teléfono:
              {missingFields.includes("phone") && (
                <Text color="red.500" ml={2} display={"inline"}>
                  Rellena estos datos debajo
                </Text>
              )}
            </FormLabel>
            <Input
              id="phone"
              placeholder="Teléfono"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <Checkbox
            id="contractSigned"
              name="contractSigned"
              isChecked={userData.contractSigned}
              onChange={handleChange}
              mr={2}
            />
            <Link href="/contrato.pdf">Contrato Terapéutico Firmado</Link>
          </FormControl>

          <FormControl isInvalid={missingFields.includes("recoveryContact")}>
            <FormLabel htmlFor="recoveryContact">
              Contacto de recuperación:
              {missingFields.includes("recoveryContact") && (
                <Text color="red.500" ml={2} display={"inline"}>
                  Rellena estos datos debajo
                </Text>
              )}
            </FormLabel>
            <Input
            id="recoveryContact"
              placeholder="Contacto de recuperación"
              name="recoveryContact"
              value={userData.recoveryContact}
              onChange={handleChange}
              autoComplete="off"
            />
          </FormControl>

          {!isGoogleUser && (
            <FormControl>
              <FormLabel htmlFor="password">Contraseña Actual</FormLabel>
              <Input
              id="password"
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

          <MyButton variant="secondary" onClick={onOpen}>
            Haz click aquí para cambiar tu Contraseña
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
