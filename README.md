# VapeClub

Proyecto fullstack (Next.js + Express + MongoDB) con integración de pagos Mercado Pago.

## Despliegue en producción

Configurá las variables de entorno en el panel de tu hosting (Railway, Vercel, etc.). No subas tokens ni secretos al repositorio.

### Backend (ej. Railway)

| Variable          | Valor en producción (ejemplo)                    |
| ----------------- | ------------------------------------------------- |
| `MP_ACCESS_TOKEN` | Access Token **de producción** de Mercado Pago   |
| `FRONTEND_URL`    | URL del frontend, sin barra final (ej. `https://vapeclub.vercel.app`) |
| `MONGODB_URI`     | URI de MongoDB en producción (ej. Atlas)         |
| `JWT_SECRET`      | Secreto fuerte para JWT (distinto al de desarrollo) |
| `PORT`            | Lo suele definir el host; no hace falta si ya lo asignan |

### Frontend (ej. Vercel)

| Variable                         | Valor en producción (ejemplo)                          |
| -------------------------------- | ----------------------------------------------------- |
| `NEXT_PUBLIC_NEXT_LOCAL_URL` o `NEXT_PUBLIC_URL` | URL del backend, sin barra final (ej. `https://vapeclub-production.up.railway.app`) |

Después de cambiar variables, redeploy del backend y del frontend para que tomen efecto.
