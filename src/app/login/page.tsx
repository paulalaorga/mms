"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/profile");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-white p-6 shadow-lg rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-2"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-4"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Iniciar sesión
        </button>
      </form>
      <button
          onClick={() => signIn("google")}
          className="w-full bg-red-500 text-white p-2 rounded mb-2"
        >
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
}
