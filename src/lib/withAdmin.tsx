"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withAdmin(Component: React.FC) {
  return function AdminProtectedComponent() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return;
      if (!session || session.user.role !== "admin") {
        router.replace("/profile"); // Redirigir si no es admin
      }
    }, [session, status, router]);

    if (status === "loading") return <p>Cargando...</p>;
    if (!session || session.user.role !== "admin") return null;

    return <Component />;
  };
}
