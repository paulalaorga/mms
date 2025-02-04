"use client";
import { useState } from "react";
import { Input, Button, Container, VStack, Heading, Alert, AlertIcon } from "@chakra-ui/react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
    } else {
      setError(data.message);
    }
  };

  return (
    <Container centerContent>
      <VStack spacing={4}>
        <Heading>Recuperar Contraseña</Heading>
        {message && <Alert status="success"><AlertIcon /> {message}</Alert>}
        {error && <Alert status="error"><AlertIcon /> {error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" colorScheme="blue" mt={4}>
            Enviar Correo
          </Button>
        </form>
      </VStack>
    </Container>
  );
}
