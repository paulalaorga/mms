"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (status === "loading") return <p>Cargando...</p>;
  if (!session)return <p>No estás autenticado. <a href="/login">Iniciar sesión</a></p>;
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password })
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage('Perfil actualizado correctamente');
      update();
    } else {
      setMessage(data.error || 'Error actualizando el perfil');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-6 shadow-lg rounded-lg w-96">
        <h1 className="text-2xl font-bold">Perfil</h1>
        <p><strong>Email:</strong> {session.user.email}</p>
        <p><strong>Rol:</strong> {session.user?.role || "Usuario"}</p>

        <form onSubmit={handleUpdate} className="mt-4">
          <label className="block mb-2">Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 mb-4"
          />

          <label className="block mb-2">Nueva Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 mb-4"
          />

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {loading ? "Guardando..." : "Actualizar"}
          </button>
        </form>

        {message && <p className="mt-4 text-green-600">{message}</p>}

        <button onClick={() => signOut()} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
