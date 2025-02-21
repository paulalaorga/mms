"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Heading, Text, Spinner, Container, VStack } from "@chakra-ui/react";
import AdminLayout from "@/components/layout/AdminLayout";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    console.log("Estado de sesión:", { session, status });

    if (!session?.user) {
      console.log("🔴 Sesion no encontrada, redirigiendo a /login desde Admin/index");
      router.replace("/login");

    } else if (session.user?.role !== "admin") {
      router.replace("/user"); // Redirige a usuarios normales
    }
  }, [session, status, router]);

  console.log("Sesión:", session);

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <Container centerContent py={10}>
        <VStack spacing={6} align="center">
        <Heading size="lg">Bienvenido, {session?.user?.name || "Administrador"} 🎉</Heading>
        <Text fontSize="lg">Este es tu panel de usuario</Text>

        <Heading size="md" mt={6}>Tus próximas sesiones</Heading>
        <Text fontSize="lg">Aquí podrás ver las sesiones que tienes programadas</Text>
        </VStack>
    </Container>
  );
}

AdminPage.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};