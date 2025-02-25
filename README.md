## 🏗️ **Branch: `feature/admin-payments-list`**

📌 **Objetivo:** Implementar una vista en el panel de administración para listar todos los pagos procesados por Paycomet.

### 🔹 **Tareas**

1️⃣ **Crear el endpoint para listar pagos (`/api/admin/payments`)**

* [X] Desarrollar un endpoint `GET /api/admin/payments` que recupere la lista de pagos.
* [X] Validar que el usuario tenga privilegios de administrador.
* [X] Integrar el servicio que se conecte a la API de Paycomet y devuelva la información de los pagos.
* [X] Manejar errores (por ejemplo, problemas de conexión o autenticación con Paycomet).

✅ **Commit:** `feat: endpoint GET /api/admin/payments para listar pagos de Paycomet`

2️⃣ **Desarrollar el servicio de integración con Paycomet**

* [X] Crear un módulo/servicio que se comunique con la API de Paycomet para obtener la lista de pagos.
* [X] Configurar las credenciales y endpoints de Paycomet mediante variables de entorno.
* [X] Realizar pruebas unitarias del servicio para asegurar que se obtiene la información correctamente.

✅ **Commit:** `feat: servicio de integración con Paycomet para listado de pagos`

3️⃣ **Construir la vista en el panel de administración**

* [X] Crear una página en el área de administración que muestre la lista de pagos en una tabla.
* [X] Incluir columnas relevantes (por ejemplo, ID de pago, orden, monto, estado, fecha, etc.).
* [X] Implementar funcionalidades de búsqueda y paginación (si es necesario).

✅ **Commit:** `feat: vista de listado de pagos en panel de administración`

4️⃣ **Tests y validaciones**

* [X] Agregar tests de integración para el endpoint de pagos.
* [X] Verificar que la vista se renderice correctamente y muestre la información real obtenida desde Paycomet.

✅ **Commit:** `test: agregar tests para listado de pagos`
