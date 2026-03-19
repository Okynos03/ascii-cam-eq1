"use client";

// ============================================================
// UploadConverter — Convierte imagenes a ASCII via API REST
// ============================================================
// Este componente demuestra el uso del Route Handler de Next.js:
//   POST /api/convert
//
// El usuario sube una imagen, se convierte a base64 en el cliente
// y se envía al servidor. El servidor procesa la imagen con
// @napi-rs/canvas y devuelve el resultado ASCII como JSON.
// ============================================================

import { useState, useRef } from "react";

interface ApiResponse {
  ascii: string;
  cols: number;
  rows: number;
  charset: string;
  processingTimeMs: number;
  timestamp: string;
}

export default function UploadConverter() {
  const [asciiResult, setAsciiResult] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [preview, setPreview] = useState<string>("");
  const [cols, setCols] = useState(80);
  const [rows, setRows] = useState(40);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Por favor sube un archivo de imagen (PNG, JPG, GIF, etc.)");
      return;
    }

    setError("");
    setAsciiResult("");
    setApiResponse(null);

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      sendToApi(base64);
    };
    reader.readAsDataURL(file);
  };

  const sendToApi = async (imageBase64: string) => {
    setLoading(true);
    try {
      // -------------------------------------------------------
      // Llamada al Route Handler de Next.js
      // POST /api/convert
      // -------------------------------------------------------
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, cols, rows }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error del servidor");
      }

      const data: ApiResponse = await response.json();
      setAsciiResult(data.ascii);
      setApiResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al contactar la API");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col flex-1 p-4 gap-4">

      {/* Explicacion del endpoint */}
      <div className="border border-green-900 bg-green-950/20 rounded p-3 text-xs text-green-700 space-y-1">
        <p className="text-green-500 font-bold">▸ API REST — Route Handler de Next.js</p>
        <p>
          <span className="text-green-600">POST</span>{" "}
          <span className="text-green-400">/api/convert</span>
          {" "}— Procesa la imagen en el servidor con @napi-rs/canvas y devuelve ASCII como JSON.
        </p>
        <p className="text-green-800">
          Ver: <code className="text-green-700">app/api/convert/route.ts (codigo)</code>
        </p>
      </div>

      <div className="flex gap-4 flex-col md:flex-row">
        {/* Panel izquierdo: controles */}
        <div className="flex flex-col gap-3 md:w-64">

          {/* Parametros */}
          <div className="border border-green-900 rounded p-3 space-y-3 text-xs">
            <p className="text-green-600 font-bold">PARAMETROS</p>
            <label className="flex flex-col gap-1 text-green-700">
              Columnas: <span className="text-green-400">{cols}</span>
              <input
                type="range" min={30} max={150} value={cols}
                onChange={e => setCols(Number(e.target.value))}
                className="accent-green-500"
              />
            </label>
            <label className="flex flex-col gap-1 text-green-700">
              Filas: <span className="text-green-400">{rows}</span>
              <input
                type="range" min={15} max={80} value={rows}
                onChange={e => setRows(Number(e.target.value))}
                className="accent-green-500"
              />
            </label>
          </div>

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-green-900 hover:border-green-700 rounded p-4 text-center cursor-pointer transition-all text-xs text-green-800 hover:text-green-600 hover:bg-green-950/20"
          >
            <p className="text-2xl mb-1 text-green-900">⬆</p>
            <p>Arrastra una imagen aqui</p>
            <p>o haz click para subir</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>

          {/* Preview */}
          {preview && (
            <div className="border border-green-900 rounded overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="preview" className="w-full h-auto opacity-70" />
              <p className="text-xs text-green-800 px-2 py-1">Original</p>
            </div>
          )}

          {/* API Response metadata */}
          {apiResponse && (
            <div className="border border-green-900 rounded p-3 text-xs space-y-1 text-green-800">
              <p className="text-green-600 font-bold">RESPONSE</p>
              <p>cols: <span className="text-green-500">{apiResponse.cols}</span></p>
              <p>rows: <span className="text-green-500">{apiResponse.rows}</span></p>
              <p>tiempo: <span className="text-green-500">{apiResponse.processingTimeMs}ms</span></p>
              <p>timestamp: <span className="text-green-500">{new Date(apiResponse.timestamp).toLocaleTimeString()}</span></p>
            </div>
          )}
        </div>

        {/* Panel derecho: ASCII output */}
        <div className="flex-1 border border-green-900 rounded bg-black overflow-auto relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
              <span className="text-green-500 text-sm animate-pulse">
                ▸ Procesando en servidor<span className="blink">_</span>
              </span>
            </div>
          )}

          {error && (
            <div className="p-4 text-red-500 text-sm border border-red-900 bg-red-950 m-4 rounded">
              ⚠ {error}
            </div>
          )}

          {asciiResult ? (
            <pre className="ascii-output p-2 text-green-400 leading-none text-[5.5px]">
              {asciiResult}
            </pre>
          ) : !loading && !error ? (
            <div className="flex items-center justify-center h-full text-green-900 text-sm p-8 text-center">
              <div>
                <p className="text-4xl mb-3 text-green-950">▲</p>
                <p>Sube una imagen para convertirla a ASCII</p>
                <p className="text-xs mt-1 text-green-900">
                  La imagen se procesara en el servidor via POST /api/convert
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
