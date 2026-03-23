"use client";

// ============================================================
// AsciiCamera — Componente principal de la cámara ASCII
// ============================================================
// Utiliza:
//   - useRef para referenciar el <video> y el <canvas> del DOM
//   - useEffect para iniciar/limpiar el stream de la cámara
//   - requestAnimationFrame para el loop de renderizado
//   - Canvas API para leer píxeles y convertirlos a ASCII
// ============================================================

import { useRef, useEffect, useState, useCallback } from "react";
import { imageDataToAscii, CHARSET_STANDARD } from "@/lib/ascii";

// ============================================================
// TODO #1 — EQUIPO 1: Filtro de inversion de colores
// ============================================================
// Implementar una función que, antes de calcular el brillo,
// invierta los valores RGB de cada pixel: r = 255-r, g = 255-g, b = 255-b.
// Agregar un boton "[ INVERT ]" en los controles que active esta opcion.
// Pista: modificar la funcion imageDataToAscii en lib/ascii.ts para
// aceptar un parametro `invert: boolean`.
// ============================================================

// ============================================================
// TODO #2 — EQUIPO 2: Ajuste de densidad/resolución ASCII
// ============================================================
// Agregar un slider que controle ASCII_COLS y ASCII_ROWS
// (por ejemplo, entre 40x20 y 200x100).
// El texto se volverá más o menos detallado según el valor.
// Pista: convertir ASCII_COLS y ASCII_ROWS a estado con useState.
// ============================================================

// ============================================================
// TODO #3 — EQUIPO 3: Guardar captura como imagen PNG (COMPLETADO)
// ============================================================
// Implementar un boton "[ SAVE PNG ]" que:
//   1. Cree un <canvas> temporal del tamaño del texto ASCII
//   2. Renderice el texto ASCII caracter por caracter sobre el canvas
//   3. Llame a canvas.toDataURL("image/png") y dispare una descarga
// Pista: usar un elemento <a> con `download` attribute para la descarga.
// ============================================================

// ============================================================
// TODO #4 — EQUIPO 4: Modo oscuro / claro
// ============================================================
// El diseño actual es siempre fondo negro + texto verde (modo "terminal").
// Agregar un toggle que cambie entre:
//   - Modo terminal: bg-black, text-green-400
//   - Modo claro: bg-white, text-gray-900
// Pista: usar un estado `theme` y aplicar clases condicionales.
// ============================================================

// ============================================================
// TODO #5 — EQUIPO 6: Selector de charset
// ============================================================
// Ver lib/ascii.ts para la descripcion completa.
// Aqui agregar un <select> o botones que cambien el charset
// y pasen la nueva variable a imageDataToAscii.
// ============================================================

export default function AsciiCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [asciiOutput, setAsciiOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string>("");
  const [fps, setFps] = useState(0);
  const [theme, setTheme] = useState<"terminal" | "light" | "amber">("terminal");
  const lastFrameTime = useRef(Date.now());
  const [mounted, setMounted] = useState(false);

  // --- TODO #2: ESTADOS Y REFERENCIAS PARA RESOLUCIÓN ---
  const [asciiCols, setAsciiCols] = useState<number>(120);
  const asciiRows = Math.floor(asciiCols / 2); // Mantiene la proporción 2:1
  
  // Usamos una referencia para el loop de animación (evita stale closures)
  const colsRef = useRef<number>(120);

  // Funcion principal del loop de renderizado
  const renderFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(renderFrame);
      return;
    }

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Dibujamos el frame del video en el canvas
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    // Read the pixels and convert to ASCII using the dynamic ref
    const currentCols = colsRef.current;
    const currentRows = Math.floor(currentCols / 2);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const ascii = imageDataToAscii(imageData, currentCols, currentRows, CHARSET_STANDARD);
    setAsciiOutput(ascii);

    // Calcular FPS
    const now = Date.now();
    const delta = now - lastFrameTime.current;
    lastFrameTime.current = now;
    setFps(Math.round(1000 / delta));

    animFrameRef.current = requestAnimationFrame(renderFrame);
  }, []);

  // Iniciar la camara
  const startCamera = useCallback(async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsRunning(true);
      animFrameRef.current = requestAnimationFrame(renderFrame);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Error al acceder a la camara: ${err.message}`
          : "No se pudo acceder a la camara."
      );
    }
  }, [renderFrame]);

  // Detener la camara
  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsRunning(false);
    setAsciiOutput("");
    setFps(0);
  }, []);

  // ============================================================
  // Implementación TODO #3: Guardar captura como PNG
  // ============================================================
  const handleSavePng = useCallback(() => {
    if (!asciiOutput) return;

    // 1. Crear un canvas temporal
    const tempCanvas = document.createElement("canvas");
    const ctx = tempCanvas.getContext("2d");
    if (!ctx) return;

    // Calculamos las dimensiones
    const fontSize = 10; 
    const lineHeight = 10;
    
    // Separamos el string ASCII en lineas
    const lines = asciiOutput.split('\n');
    
    // Configuramos el tamaño del canvas basado en el texto
    tempCanvas.width = lines[0].length * (fontSize * 0.6); 
    tempCanvas.height = lines.length * lineHeight;

    // 2. Renderizar el fondo y el texto
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    ctx.fillStyle = "#4ade80"; // verde terminal
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    // Dibujamos linea por linea
    lines.forEach((line, index) => {
      ctx.fillText(line, 0, index * lineHeight);
    });

    // 3. Convertir a imagen y descargar
    const dataUrl = tempCanvas.toDataURL("image/png");
    
    const link = document.createElement("a");
    link.download = `ascii-cam-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }, [asciiOutput]);
  // TODO #3 - Parte de Emilio Sarmiento: Crear el canvas temporal del texto ASCII
  const createTempCanvasForAscii = useCallback((text: string) => {
    if (!text) return null;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const lines = text.split("\n");
    const fontSize = 12;
    const lineHeight = fontSize * 1.2;

    // Calculamos el ancho maximo
    ctx.font = `${fontSize}px monospace`;
    let maxWidth = 0;
    for (const line of lines) {
      const width = ctx.measureText(line).width;
      if (width > maxWidth) maxWidth = width;
    }

    // Ajustamos tamaño del canvas
    canvas.width = maxWidth + 40; // padding
    canvas.height = lines.length * lineHeight + 40;

    // Pintar fondo
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pintar texto
    ctx.fillStyle = "#4ade80"; // texto verde
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    lines.forEach((line, i) => {
      ctx.fillText(line, 20, 20 + i * lineHeight);
    });

    return canvas;
  }, []);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => { setMounted(true); }, []);

  const isTerminal = theme === "terminal";
  const isAmber    = theme === "amber";

  const themeClass = isTerminal ? "bg-black text-green-400"
    : isAmber      ? "bg-black text-amber-400"
    :                "bg-white text-gray-900";

  const borderClass = isTerminal ? "border-green-900"
    : isAmber       ? "border-amber-900"
    :                 "border-gray-300";

  const btnBase = isTerminal
    ? "border border-green-700 bg-green-950 text-green-300 hover:bg-green-900"
    : isAmber
    ? "border border-amber-700 bg-amber-950 text-amber-300 hover:bg-amber-900"
    : "border border-gray-400 bg-gray-100 text-gray-800 hover:bg-gray-200";

  const labelClass = isTerminal ? "text-green-700" : isAmber ? "text-amber-700" : "text-gray-500";
  const valClass   = isTerminal ? "text-green-500" : isAmber ? "text-amber-400" : "text-gray-700";
  
  return (
    <div className={`flex flex-col flex-1 p-4 gap-4 ${themeClass} transition-colors duration-300`}>
      {/* Canvas oculto para procesar frames */}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="hidden"
      />
      {/* Video oculto — solo para capturar el stream */}
      <video
        ref={videoRef}
        muted
        playsInline
        className="hidden"
      />

      {/* Controles */}
      <div className="flex items-center gap-4 flex-wrap">
        {!isRunning ? (
          <button
            onClick={startCamera}
            className="px-5 py-2 bg-green-900 hover:bg-green-800 text-green-300 border border-green-600 rounded text-sm transition-all cursor-pointer"
          >
            ▶ INICIAR CÁMARA
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="px-5 py-2 bg-red-950 hover:bg-red-900 text-red-400 border border-red-800 rounded text-sm transition-all cursor-pointer"
          >
            ■ DETENER
          </button>
        )}

        {/* TODO #2: Density Slider */}
        <div className="flex items-center gap-2 border border-green-900 bg-black px-3 py-1.5 rounded">
          <label htmlFor="density-slider" className="text-xs text-green-600 font-bold">
            DENSITY:
          </label>
          <input
            id="density-slider"
            type="range"
            min="40"
            max="200"
            step="10"
            value={asciiCols}
            onChange={(e) => {
              const val = Number(e.target.value);
              setAsciiCols(val);       // Updates the UI
              colsRef.current = val;   // Updates the render loop
            }}
            className="w-24 cursor-pointer accent-green-500"
          />
        </div>
        {/* TODO #4: Tema */}
        {mounted && (
          <button
            onClick={() => setTheme(t => t === "terminal" ? "light" : t === "light" ? "amber" : "terminal")}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer ${btnBase}`}
          >
            {theme === "terminal" ? "◉ DARK" : theme === "light" ? "☀ LIGHT" : "◈ AMBER"}
          </button>
        )}
  
        {isRunning && (
          <button
            onClick={handleSavePng}
            className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-blue-300 border border-blue-600 rounded text-sm transition-all cursor-pointer"
          >
            [ SAVE PNG ]
          </button>
        )}

        {/* Indicadores de estado */}
        <div className={`flex items-center gap-3 text-xs ${labelClass}`}>
          <span>
            RES:{" "}
            <span className="text-green-500">
              {asciiCols}×{asciiRows}
            </span>
            <span className={valClass}>{ASCII_COLS}×{ASCII_ROWS}</span>
          </span>
          {isRunning && (
            <span>
              FPS:{" "}
              <span className={valClass}>{fps}</span>
            </span>
          )}
          <span>
            CHARSET:{" "}
            <span className={`font-bold ${valClass}`}>STANDARD</span>
          </span>
        </div>

        {isRunning && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
            <span className={`text-xs ${labelClass}`}>LIVE</span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="text-red-500 text-sm border border-red-900 bg-red-950 px-4 py-2 rounded">
          ⚠ {error}
        </div>
      )}

      {/* ASCII Output */}
      <div className={`flex-1 bg-black border rounded overflow-auto relative ${borderClass}`}>
        {!isRunning && !asciiOutput ? (
          <div className="flex items-center justify-center h-full min-h-[300px] text-green-800 text-sm">
            <div className="text-center">
              <div className="text-5xl mb-4 text-green-900">◉</div>
              <p>Presiona <span className="text-green-600">▶ INICIAR CAMARA</span> para comenzar</p>
              <p className="mt-1 text-xs text-green-900">Tu imagen sera convertida a ASCII</p>
            </div>
          </div>
        ) : (
      <pre
        className="ascii-output p-2 leading-none"
        style={{ color: isTerminal ? "#4ade80" : isAmber ? "#fbbf24" : "#111111" }}
      >
        {asciiOutput}
      </pre>
        )}
      </div>

    </div>
  );
}