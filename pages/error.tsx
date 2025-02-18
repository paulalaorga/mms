import Link from "next/link";

export default function ErrorPage() {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>❌ Error en el Pago</h1>
        <p>Hubo un problema con tu pago. Por favor, intenta de nuevo.</p>
        <Link href="/">Volver a Inicio</Link>
      </div>
    );
  }
  