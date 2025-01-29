"use client";

import { useSession, signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  if (!session) {
    return <p>No estás autenticado. <a href="/login">Iniciar sesión</a></p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold">Perfil</h1>
        <p><strong>Nombre:</strong> {session.user.name}</p>
        <p><strong>Email:</strong> {session.user.email}</p>
        <p><strong>Rol:</strong> {session.user.role}</p>

        <button onClick={() => signOut()} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
