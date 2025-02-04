"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Heading, Text, Spinner } from "@chakra-ui/react";
import AdminLayout from "./layout";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/profile");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <>
      <Heading>Dashboard de Administrador</Heading>
      <Text>Selecciona una opción en el menú lateral.</Text>
    </>
  );
}

AdminPage.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};