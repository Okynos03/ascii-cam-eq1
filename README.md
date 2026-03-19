# ASCII Cam 

> Camara en tiempo real que convierte el video a arte ASCII — construida con **Next.js 15**.  
> Prractica/expo para la materia de **Tópicos Avanzados de Programación Web**.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

---

## ¿Qué hace este proyecto?

- **Cámara ASCII en vivo**: Accede a tu webcam y renderiza cada frame como arte ASCII en tiempo real usando el Canvas API del navegador.
- **Conversión via API REST**: Sube cualquier imagen y el servidor la convierte a ASCII usando un Route Handler de Next.js (`POST /api/convert`).

---

## Tecnologías de Next.js que se demuestran

| Concepto | Dónde |
|---|---|
| **App Router** | Estructura de carpetas `app/` |
| **Route Handlers** | `app/api/convert/route.ts` |
| **Client Components** | `"use client"` en `AsciiCamera.tsx` y `UploadConverter.tsx` |
| **Server Components** | `app/layout.tsx` y `app/page.tsx` (por defecto server) |
| **Metadata API** | `export const metadata` en `layout.tsx` |
| **TypeScript** | Todo el proyecto |

---

## Instalacion y uso

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/ascii-cam.git
cd ascii-cam

# 2. Instalar dependencias
npm install

# 3. Correr en desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:3000
```

### Requisitos
- Node.js 18+
- npm 9+
- Una webcam (para la funcion de camara en vivo)

--

## API REST

### `GET /api/convert`
Devuelve la documentacion del endpoint.

### `POST /api/convert`

Convierte una imagen a ASCII en el servidor.

**Body (JSON):**
```json
{
  "imageBase64": "data:image/png;base64,iVBORw0KGgo...",
  "cols": 80,
  "rows": 40
}
```

**Respuesta:**
```json
{
  "ascii": " ...texto ASCII... ",
  "cols": 80,
  "rows": 40,
  "processingTimeMs": 42,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Estructura del proyecto

```
ascii-cam/
├── app/
│   ├── api/
│   │   └── convert/
│   │       └── route.ts        ← Route Handler (API REST)
│   ├── globals.css
│   ├── layout.tsx              ← Server Component (Root Layout)
│   └── page.tsx                ← Server Component (Home)
├── components/
│   ├── AsciiCamera.tsx         ← Client Component (camara en vivo)
│   └── UploadConverter.tsx     ← Client Component (subida de imagen)
├── lib/
│   └── ascii.ts                ← Logica de conversion ASCII
└── README.md
```

---

##  Funcionalidades pendientes (para los equipos)

Este proyecto tiene **5 funcionalidades** marcadas con comentarios `TODO` en el codigo. Cada equipo debe implementar una y hacer un Pull Request.

| # | Funcionalidad | Archivo(s) | Dificultad |
|---|---|---|---|
| 1 | Filtro de inversión de colores | `lib/ascii.ts`, `components/AsciiCamera.tsx` |  Facil |
| 2 | Ajuste de densidad/resolución | `components/AsciiCamera.tsx` |  Facil |
| 3 | Guardar captura como PNG | `components/AsciiCamera.tsx` |  Media |
| 4 | Modo oscuro / claro  | `components/AsciiCamera.tsx`, `app/globals.css` |  Facil |
| 5 | Selector de charset | `lib/ascii.ts`, `components/AsciiCamera.tsx` |  Facil |

**Ver [`CONTRIBUTING.md`](./CONTRIBUTING.md) para instrucciones de como hacer el PR.**

---

## Evidencia

Para la entrega, toma una foto del proyecto corriendo y la captura del PR.

---

