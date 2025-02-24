## 🏗️ **Branch: `feature/admin-payments-list`**

📌 **Objetivo:** Implementar una vista en el panel de administración para listar todos los pagos procesados por Paycomet.

### 🔹 **Tareas**

1️⃣ **Crear el endpoint para listar pagos (`/api/admin/payments`)**

* [ ] Desarrollar un endpoint `GET /api/admin/payments` que recupere la lista de pagos.
* [ ] Validar que el usuario tenga privilegios de administrador.
* [ ] Integrar el servicio que se conecte a la API de Paycomet y devuelva la información de los pagos.
* [ ] Manejar errores (por ejemplo, problemas de conexión o autenticación con Paycomet).

✅ **Commit:** `feat: endpoint GET /api/admin/payments para listar pagos de Paycomet`

2️⃣ **Desarrollar el servicio de integración con Paycomet**

* [ ] Crear un módulo/servicio que se comunique con la API de Paycomet para obtener la lista de pagos.
* [ ] Configurar las credenciales y endpoints de Paycomet mediante variables de entorno.
* [ ] Realizar pruebas unitarias del servicio para asegurar que se obtiene la información correctamente.

✅ **Commit:** `feat: servicio de integración con Paycomet para listado de pagos`

3️⃣ **Construir la vista en el panel de administración**

* [ ] Crear una página en el área de administración que muestre la lista de pagos en una tabla.
* [ ] Incluir columnas relevantes (por ejemplo, ID de pago, orden, monto, estado, fecha, etc.).
* [ ] Implementar funcionalidades de búsqueda y paginación (si es necesario).

✅ **Commit:** `feat: vista de listado de pagos en panel de administración`

4️⃣ **Tests y validaciones**

* [ ] Agregar tests de integración para el endpoint de pagos.
* [ ] Verificar que la vista se renderice correctamente y muestre la información real obtenida desde Paycomet.

✅ **Commit:** `test: agregar tests para listado de pagos`
