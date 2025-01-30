'use client'

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";



export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "admin") {
      router.push("/profile");
    } 
  }, [session, status, router]);

  if (status === "loading") return <p>Cargando...</p>;


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Panel de Administrador</h1>
      <p>Bienvenido, tienes permisos de administrador.</p>
    </div>
  );
}


