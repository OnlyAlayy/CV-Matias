import type { VercelRequest, VercelResponse } from '@vercel/node';

/* ===== Resume Data (server-side only) ===== */
const resumeChunks = [
  { id: "perfil", content: "Matías Ojeda Ferreyra es un Técnico en Programación y Desarrollador Full Stack especializado en React, Node.js e integración de Inteligencia Artificial. Vive en Avellaneda, Buenos Aires, Argentina. Cuenta con 7 años de formación técnica en la E.E.S.T. N°7 'José Hernández' y experiencia freelance en múltiples proyectos. Email de contacto: ojedaferreyramatias@gmail.com. LinkedIn: linkedin.com/in/matias-ojeda-ferreyra. GitHub: OnlyAlayy." },
  { id: "sobre-mi", content: "Matías es un desarrollador Full Stack proactivo y en constante evolución. Combina la experiencia del trabajo freelance con conocimiento estructurado en múltiples lenguajes y bases de datos. Prioriza la creación de soluciones web funcionales, escalables y centradas en el usuario. Se encuentra en formación continua dentro del ecosistema de Inteligencia Artificial (certificaciones de Anthropic y NVIDIA). Aplica activamente técnicas avanzadas de Prompt Engineering y el framework de las 4D para interactuar con modelos de IA." },
  { id: "habilidades", content: "Habilidades técnicas de Matías: React.js, Node.js, Express, MongoDB, TypeScript, Tailwind CSS, Framer Motion, Google Gemini AI, sistemas RAG, Vite, Git, REST APIs, Vercel, Render, EmailJS, Twilio API, WhatsApp API, Figma, Trello, metodologías ágiles. Aptitudes principales: integración de datos, seguridad de aplicaciones web (Helmet, Rate Limiting, CORS, mitigación de SQL Injection), despliegue de producción (CI/CD), Prompt Engineering." },
  { id: "sintax-ai", content: "SINTAX-AI es el proyecto avanzado de Inteligencia Artificial de Matías, enfocado en comprender contextos complejos de código fuente y asistir a programadores. Es un repositorio privado en GitHub." },
  { id: "devpulse", content: "DevPulse es una Inteligencia Artificial de Observabilidad y monitoreo para equipos de desarrollo, creada por Matías." },
  { id: "experiencia-catalogoval", content: "Experiencia profesional: Desarrollador Full Stack en Dipartimento (abril 2026, 1 mes) — Uruguay. Lideró la arquitectura, diseño y desarrollo completo del catálogo digital para Val Postress. Plataforma web de estilo editorial y estética premium. Stack: React.js (frontend), Node.js/Express (backend). Implementó seguridad robusta (SQL Injection, Helmet, Rate Limiting, CORS). Despliegue en Vercel (frontend) y Render (backend) con CI/CD." },
  { id: "experiencia-paradise", content: "Experiencia profesional: Web Full Stack en Taller Paradise (julio 2025 – noviembre 2025, 5 meses). Diseñó y desarrolló una SPA personalizada para un estudio de arte y tienda de materiales. Frontend ultra-fluido con React, Tailwind CSS y Framer Motion (60 FPS). Backend con Node.js, Express y MongoDB. E-commerce con carrito dinámico integrado con WhatsApp API. Automatización con EmailJS y Twilio (SMS/WhatsApp). Panel de administración privado (CRUD completo)." },
  { id: "experiencia-municipalidad", content: "Experiencia profesional: Pasante en la Municipalidad de Avellaneda (mayo 2025 – junio 2025, 2 meses). Colaboró en el desarrollo de una aplicación municipal con React.js y Node.js. Implementó componentes funcionales responsivos. Participó en reuniones técnicas con metodologías ágiles." },
  { id: "educacion", content: "Educación: Técnico en Programación en la Escuela de Educación Secundaria Técnica N°7 'José Hernández' (marzo 2019 – noviembre 2025). 7 años de especialización técnica en programación." },
  { id: "certificaciones", content: "Certificaciones de Matías (más de 16 certificaciones especializadas): Model Context Protocol (MCP) Advanced & Intro (Anthropic), Claude with Google Cloud Vertex AI (Anthropic), Claude with Amazon Bedrock (Anthropic), Building with the Claude API (Anthropic), Claude Code in Action (Anthropic), Introduction to subagents (Anthropic), Introduction to agent skills (Anthropic), Introduction to Claude Cowork (Anthropic), AI Fluency Framework & Foundations (Anthropic), Teaching the AI Fluency Framework (Anthropic), AI Fluency for nonprofits/educators/students (Anthropic), Claude 101 (Anthropic), Getting Started with AI on Jetson Nano (NVIDIA), Certificado oficial EF SET 51/100 (Inglés B2 Intermedio Alto)." },
  { id: "turrs-tienda", content: "Turrs Tienda es una tienda online completa y escalable desarrollada con React, Node.js y MongoDB. Es un proyecto público en el GitHub de Matías (OnlyAlayy)." },
  { id: "galeria-y-cvs", content: "Matías desarrolla sistemas modernos de gestión de imágenes (Galerías) y múltiples CVs web interactivos a medida para clientes. Tiene amplia experiencia en proyectos de e-commerce con múltiples versiones iterativas." },
  { id: "contacto", content: "Para contactar a Matías: email ojedaferreyramatias@gmail.com, LinkedIn linkedin.com/in/matias-ojeda-ferreyra, GitHub github.com/OnlyAlayy. Está disponible para nuevos proyectos freelance y oportunidades laborales." },
];

const systemPrompt = `Eres el asistente personal de Matías Ojeda Ferreyra, integrado en su portfolio web. Respondes preguntas de reclutadores y visitantes sobre su experiencia, habilidades y proyectos.

Reglas:
- Responde en español, de forma profesional y directa.
- Sé breve: máximo 2 párrafos por respuesta.
- Usa SOLO la información del contexto proporcionado.
- Si no tenés información suficiente, invitá a contactar a Matías directamente.
- No inventes datos ni logros que no estén en el contexto.`;

/* ===== Server-side Rate Limiting (IP-based) ===== */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 30; // max 30 requests per IP per hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  return false;
}

/* ===== Simple keyword search (server-side Fuse.js alternative) ===== */
function searchChunks(query: string): string[] {
  const words = query.toLowerCase().split(/\s+/);
  const scored = resumeChunks.map((chunk) => {
    const lower = chunk.content.toLowerCase();
    const score = words.filter((w) => lower.includes(w)).length;
    return { content: chunk.content, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.filter((s) => s.score > 0).slice(0, 3).map((s) => s.content);
}

/* ===== API Handler ===== */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Demasiadas consultas. Intentá de nuevo más tarde.' });
  }

  // Validate input
  const { message, history } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensaje inválido.' });
  }

  const sanitizedMessage = message.trim().slice(0, 300);
  if (sanitizedMessage.length === 0) {
    return res.status(400).json({ error: 'Mensaje vacío.' });
  }

  // Check API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key no configurada en el servidor.' });
  }

  try {
    // RAG search
    const topChunks = searchChunks(sanitizedMessage);
    const contextText = topChunks.length > 0
      ? topChunks.join('\n\n')
      : 'No hay información específica. Sugerí contactar a Matías directamente.';

    // Build history for Gemini (ensure it starts with 'user')
    const validHistory: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    if (Array.isArray(history)) {
      let foundUser = false;
      for (const msg of history.slice(-4)) {
        if (!foundUser && msg.role !== 'user') continue;
        foundUser = true;
        validHistory.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: String(msg.text || '').slice(0, 500) }],
        });
      }
    }

    // Call Gemini API directly via REST (no SDK dependency needed server-side)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

    const geminiBody = {
      system_instruction: { parts: [{ text: `${systemPrompt}\n\nContexto relevante:\n${contextText}` }] },
      contents: [
        ...validHistory,
        { role: 'user', parts: [{ text: sanitizedMessage }] },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    };

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errText);
      return res.status(502).json({ error: 'Error al contactar el servicio de IA.' });
    }

    // Stream the response back to the client
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = geminiRes.body as any;

    // Node.js readable stream from fetch response
    for await (const chunk of reader) {
      const text = typeof chunk === 'string' ? chunk : new TextDecoder().decode(chunk);
      // Forward SSE events directly
      const lines = text.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (content) {
              res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
            }
          } catch {
            // Skip non-JSON lines
          }
        }
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
