"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      alert("Error en el registro");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleRegister} className="bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Registro</h1>
        <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 mb-2" />
        <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 mb-2" />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 mb-4" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Registrarse</button>
      </form>
    </div>
  );
}
