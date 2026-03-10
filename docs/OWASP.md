# OWASP Top 10 – Medidas aplicadas en vapeClub

Este documento describe cómo se han aplicado las recomendaciones del [OWASP Top 10](https://owasp.org/Top10/) en el proyecto.

---

## A01:2021 – Broken Access Control

- **GET /api/user/users**: Protegido con `authenticateToken` + `requireAdmin`. Solo administradores pueden listar usuarios.
- **Rutas de productos (crear, editar, eliminar, subir imagen)**: Protegidas con `authenticateToken` y `requireAdmin`. Solo admins pueden modificar el catálogo.
- **Middleware `requireAdmin`**: Ubicado en `backend/server/middlewares/requireAdmin.js`, se usa después de `authenticateToken` para garantizar que `req.user` exista y tenga `role === 'admin'`.

---

## A02:2021 – Cryptographic Failures

- **Cloudinary**: Las credenciales ya no están en código. Se usan variables de entorno `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (ver `backend/.env.example`).
- **Contraseñas**: Se hashean con bcrypt en el modelo `User` (pre-save). En el registro se envía la contraseña en claro al modelo para evitar doble hash.
- **JWT**: Se usa `JWT_SECRET` desde variables de entorno. En producción debe ser un secreto fuerte (mín. 32 caracteres aleatorios).

---

## A03:2021 – Injection

- **IDs de producto**: Se valida que `req.params.id` sea un ObjectId válido de MongoDB (`mongoose.Types.ObjectId.isValid`) antes de usarlo en consultas.
- **Entrada de productos**: Campos como nombre, descripción, marca y sabores se normalizan (trim, longitud máxima) y se validan tipos (precio numérico, arrays limitados).
- **Entrada de usuario**: Email se sanitiza (trim, toLowerCase, longitud) y se valida con expresión regular; nombre y contraseña con longitud mínima/máxima.

---

## A04:2021 – Insecure Design

- **Rate limiting**: 
  - Rutas bajo `/api/user`: 20 solicitudes por 15 minutos (auth).
  - `/api/productos` y `/api/payment`: 200 solicitudes por 15 minutos.
- **CORS**: Orígenes restringidos en `dbconfig.js` (no `*` en producción).

---

## A05:2021 – Security Misconfiguration

- **Helmet**: Cabeceras de seguridad activadas en el backend (`helmet()` con `contentSecurityPolicy: false` para evitar conflictos con frontend).
- **Límite de body**: `express.json({ limit: "500kb" })` y mismo límite en `urlencoded` para evitar payloads enormes.
- **Errores al cliente**: En producción no se exponen detalles internos (p. ej. en `payment.js` los detalles de error de Mercado Pago solo en desarrollo).
- **Variables sensibles**: Todas en `.env`; `.env.example` documenta las necesarias sin valores reales.

---

## A06:2021 – Vulnerable and Outdated Components

- Ejecutar periódicamente `npm audit` en `client` y `backend` y aplicar `npm audit fix` cuando sea posible.
- Mantener dependencias actualizadas.

---

## A07:2021 – Identification and Authentication Failures

- **Login**: Validación de email, mensaje genérico ante credenciales incorrectas, registro de fallos en `securityLog`.
- **JWT**: Verificación con `JWT_SECRET`; token en cabecera `Authorization: Bearer <token>`.
- **Rutas sensibles**: Protegidas con `authenticateToken`; rutas admin con `requireAdmin`.
- **Contraseña**: Mínimo 8 caracteres en registro.

---

## A08:2021 – Software and Data Integrity Failures

- Usar `package-lock.json` y no instalar dependencias desde fuentes no confiables.
- En producción, asegurar que `JWT_SECRET` y tokens de terceros (Mercado Pago, Cloudinary) se rotan si hay compromiso.

---

## A09:2021 – Security Logging and Monitoring Failures

- **Middleware `securityLogger`**: En `backend/server/middlewares/securityLogger.js` se registran eventos como:
  - `LOGIN_FAILED` (usuario no encontrado o contraseña incorrecta).
  - `INVALID_TOKEN` (token JWT inválido o expirado).
  - `ACCESS_DENIED` (usuario autenticado sin rol admin intentando acceder a ruta admin).
- Los logs se escriben en consola con prefijo `[SECURITY]`. En producción se recomienda enviarlos a un SIEM o servicio de logging.

---

## A10:2021 – Server-Side Request Forgery (SSRF)

- En `payment.js`, las URLs de retorno (success/failure/pending) se construyen solo con `FRONTEND_URL` del entorno.
- Se valida que `FRONTEND_URL` pertenezca a una lista permitida de hosts (localhost, vapeclub.vercel.app, etc.) antes de usarla en `back_urls` de Mercado Pago.

---

## Variables de entorno (resumen)

| Variable | Uso |
|----------|-----|
| `MONGODB_URI` | Conexión a MongoDB |
| `PORT` | Puerto del backend |
| `JWT_SECRET` | Firma de tokens JWT (secreto fuerte en producción) |
| `FRONTEND_URL` | URL del frontend (CORS y redirecciones de pago) |
| `MP_ACCESS_TOKEN` | Mercado Pago |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary |
| `NODE_ENV` | `development` / `production` (afecta mensajes de error y logging) |

Configurar todas las variables en el entorno de producción y no subir `.env` al repositorio.
