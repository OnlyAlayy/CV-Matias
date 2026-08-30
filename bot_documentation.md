# Documentación del Sistema RAG — Chatbot del CV

## Resumen

El chatbot integrado en el portfolio de Matías utiliza una arquitectura **RAG (Retrieval-Augmented Generation)** con búsqueda léxica local. No envía toda la información del CV en cada consulta — en su lugar, busca y extrae solo los fragmentos relevantes antes de enviarlos al modelo de lenguaje.

---

## Arquitectura

```
┌──────────────────────────────────────────────────┐
│  Usuario escribe una pregunta                    │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│  1. Lexical Search (Fuse.js)                     │
│     Busca en los chunks locales el texto más     │
│     relevante a la consulta. Tolerancia a        │
│     errores de tipeo (fuzzy matching).            │
│     Resultado: top 3 fragmentos.                 │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│  2. Prompt Assembly                              │
│     Se arma un prompt compacto con:              │
│     - System prompt (instrucciones del bot)      │
│     - Contexto relevante (solo los 3 chunks)     │
│     - Últimos 4 mensajes del historial           │
│     - La pregunta del usuario                    │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│  3. Google Gemini (gemini-1.5-flash)             │
│     Recibe el prompt reducido y genera una       │
│     respuesta en STREAMING — el texto aparece    │
│     en tiempo real mientras se genera.           │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│  4. Respuesta renderizada en el chat             │
│     Markdown básico (negritas, código) se        │
│     convierte a HTML con un parser propio.       │
│     Sin dependencias externas de rendering.      │
└──────────────────────────────────────────────────┘
```

---

## Archivos Involucrados

| Archivo | Función |
|---|---|
| `src/data/chunks.ts` | Fragmentos de información del CV (chunks) + system prompt |
| `src/components/Chatbot.tsx` | UI del chat + lógica RAG + streaming |
| `.env` | API Key de Google Gemini (`VITE_GEMINI_API_KEY`) |

---

## Optimización de Tokens

| Enfoque | Tokens por consulta |
|---|---|
| Enviar todo el CV completo | ~2000-8000 tokens |
| **RAG con Lexical Search** | **~100-300 tokens** |

El ahorro es de aproximadamente un **95%** por consulta.

---

## Búsqueda Léxica (Fuse.js)

- **Motor:** Fuse.js (client-side, sin servidor ni base de datos vectorial)
- **Método:** Fuzzy matching con threshold de 0.6
- **Tolerancia:** Acepta errores ortográficos ("sintax", "syntac", "devpuls")
- **Velocidad:** < 1ms por búsqueda (ejecuta en el navegador del visitante)

---

## Streaming

Las respuestas usan `generateContentStream` de la API de Gemini. El texto aparece progresivamente en la UI, simulando escritura en tiempo real. No se espera a que se complete toda la respuesta.

---

## Markdown Renderer

Se usa un parser propio inline (sin react-markdown ni dependencias externas) que soporta:
- **Negritas** (`**texto**`)
- `Código inline` (`` `texto` ``)
- Saltos de línea

Esto evita problemas de compatibilidad con versiones de librerías externas.
