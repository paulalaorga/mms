"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Heading, Text, Spinner } from "@chakra-ui/react";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <>
      <Heading>Perfil de Usuario</Heading>
      <Text>Bienvenido, {session?.user?.name}.</Text>
      <Text>Email: {session?.user?.email}</Text>
      <Text>Rol: {session?.user?.role}</Text>
    </>
  );
}
