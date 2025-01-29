import withAdmin from "@/lib/withAdmin";

function AdminPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Panel de Administrador</h1>
      <p>Bienvenido, tienes permisos de administrador.</p>
    </div>
  );
}

export default withAdmin(AdminPage);
