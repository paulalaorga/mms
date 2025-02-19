# 📌 Desarrollo de la Página de Programas - MMS

Este documento contiene el plan de trabajo para la implementación de la página `/programs` en la aplicación MMS.

## 🚀 **Tareas y Progreso**

### 🏗️ **1️⃣ Estructura de la Página de Programas**

- [ ] Crear el archivo `pages/programs.tsx`
- [ ] Agregar lista de programas con:
  - [ ] Nombre
  - [ ] Descripción
  - [ ] Precio
- [ ] Estilos en `Programs.module.css` o Tailwind
  ✅ **Commit:** `feat: estructura inicial de la página de programas`

### 🔗 **2️⃣ Obtener Programas desde la Base de Datos**

- [ ] Crear el modelo `models/Program.ts`
- [ ] Crear el endpoint `GET /api/programs`
- [ ] Usar `getServerSideProps` para cargar los datos en `/programs`
  ✅ **Commit:** `feat: conectar la página de programas con la API`

### 🛒 **3️⃣ Agregar Botón de Compra**

- [ ] Implementar un botón "Comprar ahora" en cada programa
- [ ] Redirigir a la página de pago (`/checkout`)
  ✅ **Commit:** `feat: agregar botones de compra en los programas`

### 🎨 **4️⃣ Diseño y Estilos Mejorados**

- [ ] Implementar diseño responsive con Tailwind
- [ ] Hacer la página visualmente atractiva con imágenes e iconos
  ✅ **Commit:** `style: mejorar el diseño de la página de programas`

### 💳 **5️⃣ Integración con Paycomet**

- [ ] Llamar a `form.ts` para generar el enlace de pago
- [ ] Redirigir al usuario a la pasarela de pago
  ✅ **Commit:** `feat: integración con Paycomet en la página de programas`
