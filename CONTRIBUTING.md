# Guia de Contribucion 

Guia oficial: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo <br><br>
Esta guía explica como trabajar en tu funcionalidad y enviar un Pull Request al repositorio original.

---

## Flujo de trabajo

```
Repositorio original (Equipo 5)
        │
        ▼
   Tu fork (GitHub)
        │
        ▼
  Tu clon local (tu computadora)
        │  [haces cambios]
        ▼
   Tu fork (push)
        │
        ▼
   Pull Request ──► Repositorio original
```

---

## Paso 1: Hacer fork del repositorio

1. Entra al repositorio original en GitHub.
2. Haz click en el boton **Fork** (arriba a la derecha).
3. Selecciona tu cuenta de GitHub como destino.

---

## Paso 2: Clonar tu fork

```bash
git clone https://github.com/TU_USUARIO/ascii-cam.git
cd ascii-cam
```

---

## Paso 3: Instalar dependencias y correr el proyecto

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) y verifica que todo funciona.

---

## Paso 4: Crear una rama para tu funcionalidad

```bash
# Usa el numero y nombre de tu TODO
git checkout -b feature/todo-1-invertir-colores
```

Nombres sugeridos por equipo:
- `feature/todo-1-invertir-colores`
- `feature/todo-2-ajuste-densidad`
- `feature/todo-3-guardar-png`
- `feature/todo-4-modo-oscuro`
- `feature/todo-5-selector-charset`

---

## Paso 5: Implementar tu funcionalidad

Busca el comentario `TODO #N` correspondiente a tu equipo en el codigo. Están en:
- `components/AsciiCamera.tsx`
- `lib/ascii.ts`

Lee las instrucciones del TODO y implementa la funcionalidad.

---

## Paso 6: Commit y push

```bash
git add .
git commit -m "feat: implementar TODO #1 - filtro de inversion de colores"
git push origin feature/todo-1-invertir-colores
```

---

## Paso 7: Crear el Pull Request

1. Ve a tu fork en GitHub.
2. GitHub detectara tu nueva rama y mostrara un boton **"Compare & pull request"**.
3. Haz click en ese boton.
4. Llena el formulario:
   - **Titulo**: `[Equipo N] TODO #N: Nombre de la funcionalidad`
   - **Descripción**: Explica que hiciste y como funciona.
   - **Evidencia**: Adjunta una foto o captura de pantalla.

---

## Descripcion de las funcionalidades

### TODO #1 — Filtro de inversión de colores (Equipo 1)

**Archivos:** `lib/ascii.ts`, `components/AsciiCamera.tsx`

Agrega un parametro `invert: boolean` a la función `imageDataToAscii`. Cuando sea `true`, antes de calcular el brillo, invierte los valores RGB de cada píxel:
```ts
const r = invert ? 255 - data[idx] : data[idx];
```
Agrega un boton `[ INVERT ]` en los controles de `AsciiCamera.tsx`.

---

### TODO #2 — Ajuste de densidad/resolución ASCII (Equipo 2)

**Archivos:** `components/AsciiCamera.tsx`

Convierte `ASCII_COLS` y `ASCII_ROWS` de constantes a estado con `useState`. Agrega dos sliders en los controles para que el usuario ajuste la resolución en tiempo real.

```tsx
const [cols, setCols] = useState(120);
const [rows, setRows] = useState(60);
```

---

### TODO #3 — Guardar captura como imagen PNG (Equipo 3)

**Archivos:** `components/AsciiCamera.tsx`

Agrega un boton `[ SAVE PNG ]`. Al presionarlo:
1. Crea un `<canvas>` temporal.
2. Escribe el texto ASCII caracter por caracter usando `ctx.fillText`.
3. Descarga el resultado con `canvas.toDataURL("image/png")` y un `<a download>`.

---

### TODO #4 — Modo oscuro / claro  (Equipo 4)

**Archivos:** `components/AsciiCamera.tsx`

Agrega un estado `theme` con tres valores: `"terminal"`, `"light"`, `"amber"`. Aplica clases de Tailwind condicionales al contenedor principal. Agrega botones de toggle en los controles.

---

### TODO #5 — Selector de charset (Equipo 5)

**Archivos:** `lib/ascii.ts`, `components/AsciiCamera.tsx`

En `lib/ascii.ts` define varios charsets adicionales. En `AsciiCamera.tsx` agrega un `<select>` o botones que cambien el charset activo y lo pasen a `imageDataToAscii`.

```ts
export const CHARSET_BLOCKS  = " ░▒▓█";
export const CHARSET_MINIMAL = " .:-=+*#%@";
export const CHARSET_DENSE   = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
```

---

## Convencion de commits

```
feat: descripción corta de lo que se implementó
fix: descripción de lo que se corrigió
docs: cambios en documentación
```

---

