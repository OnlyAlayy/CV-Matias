export type Lang = 'es' | 'en';

export const t = {
  es: {
    // Nav
    navProjects: 'Proyectos',
    navExperience: 'Experiencia',
    navContact: 'Contacto',

    // Hero
    available: 'Disponible para proyectos',
    location: 'Avellaneda, Buenos Aires, Argentina',
    heroTitle1: 'Técnico en Programación · Desarrollador',
    heroTitle2: 'Full Stack',
    heroTitle3: ' (React/Node.js) con integración de',
    heroTitle4: 'Inteligencia Artificial',
    heroSub: '7 años de formación técnica especializada. Experiencia real en productos en producción, pasantías y proyectos freelance. Certificado en IA por Anthropic.',
    ctaProjects: 'Ver proyectos',
    ctaContact: 'Escribirme',

    // About
    aboutLabel: 'Sobre mí',
    aboutHeading: 'Construyo productos web\nque realmente funcionan.',
    aboutP1: 'Desarrollador Full Stack con 7 años de formación técnica en la E.E.S.T. N°7. Combino experiencia freelance real con conocimiento estructurado en múltiples lenguajes, frameworks y bases de datos. Priorizo código limpio, UX sólida y soluciones escalables.',
    aboutP2: 'Me encuentro en formación continua dentro del ecosistema de IA — tengo certificaciones de Anthropic (Claude, Amazon Bedrock, Google Vertex AI) y aplico Prompt Engineering avanzado y metodologías estructuradas en mi flujo de trabajo diario.',
    certsLabel: 'Certificaciones',

    // Projects
    portfolioLabel: 'Portfolio',
    portfolioHeading: 'Proyectos destacados',
    stackLabel: 'Stack Técnico',
    viewAll: 'Ver todos en GitHub',

    // Experience
    expLabel: 'Trayectoria',
    expHeading: 'Experiencia',
    eduRole: 'Técnico en Programación',
    eduCompany: 'E.E.S.T. N°7 "José Hernández"',
    eduPeriod: 'Mar 2019 – Nov 2025 · 7 años',
    eduDesc: 'Formación técnica especializada en programación. Base estructurada en múltiples lenguajes, bases de datos y buenas prácticas de desarrollo de software.',

    // Contact
    contactLabel: 'Contacto',
    contactHeading: '¿Tenés un proyecto en mente?',
    contactSub: 'Estoy disponible para proyectos freelance y oportunidades laborales. Escribime y hablemos.',

    // Footer
    footerRights: '© 2026 Matías Ojeda Ferreyra',

    // Projects data
    projects: [
      {
        name: 'SINTAX-AI (Auditor)',
        description: 'SaaS Full-Stack para auditoría corporativa. Procesamiento de audio con AssemblyAI (diarización) y Gemini AI para evaluar el rendimiento. Frontend en React con dashboards interactivos (Recharts), visualización de ondas y websockets en tiempo real.',
        tags: ['React', 'Node.js', 'Gemini', 'AssemblyAI'],
        accent: 'rgba(167,139,250,0.5)',
        href: 'https://github.com/OnlyAlayy/SINTAX-AI',
        span: 'md:col-span-7',
      },
      {
        name: 'Jarvis',
        description: 'Asistente de voz personal con IA. Wake word detection, integración con WhatsApp, control del sistema Windows, síntesis de voz offline (Piper) y módulos de visión, domótica y búsqueda semántica de archivos (RAG local).',
        tags: ['Python', 'IA', 'WhatsApp API', 'RAG'],
        accent: 'rgba(96,165,250,0.5)',
        href: 'https://github.com/OnlyAlayy/Jarvis',
        span: 'md:col-span-5',
      },
      {
        name: 'Taller Paradise',
        description: 'SPA completa para un estudio de arte: e-commerce con WhatsApp API, panel de admin, automatizaciones con Twilio y EmailJS. React + Node.js + MongoDB.',
        tags: ['React', 'Node.js', 'MongoDB', 'Twilio'],
        accent: 'rgba(52,211,153,0.5)',
        href: 'https://taller-paradise.vercel.app',
        span: 'md:col-span-5',
        images: ['/projects/TALLERPARADISE.png', '/projects/TALLERPARADISE2.png', '/projects/TALLERPARADISE3.png', '/projects/TALLERPARADISE4.png']
      },
      {
        name: 'CatalogoVal',
        description: 'Catálogo digital premium de estilo editorial para Val Postress. Arquitectura full-stack con seguridad avanzada (Helmet, Rate Limiting, CORS) y CI/CD en Vercel + Render.',
        tags: ['Full Stack', 'Seguridad', 'CI/CD'],
        accent: 'rgba(251,191,36,0.4)',
        href: 'https://val-postress.vercel.app',
        span: 'md:col-span-7',
        images: ['/projects/VALPOSTRES.png', '/projects/VALPOSTRES1.png', '/projects/VALPOSTRES2.png', '/projects/VALPOSTRES4.png', '/projects/VALPOSTRES5.png', '/projects/VALPOSTRES6.png']
      },
    ],
    secondaryProjects: [
      { name: 'Turrs Tienda', desc: 'E-commerce con React, Node.js y MongoDB.', tags: ['React', 'MongoDB'], href: 'https://github.com/OnlyAlayy/turrs-tienda', images: ['/projects/TURRSTIENDA1.png', '/projects/TURRSTIENDA2.png', '/projects/TURRSTIENDA3.png', '/projects/TURRSTIENDA4.png'] },
      { name: 'Media Kit Dilan', desc: 'Portafolio web bilingüe con Framer Motion.', tags: ['React', 'Framer'], href: 'https://github.com/OnlyAlayy/MediaKit', images: ['/projects/MEDIAKITDILAN.png', '/projects/MEDIAKITDILAN2.png', '/projects/MEDIAKITDILAN3.png', '/projects/MEDIAKITDILAN4.png', '/projects/MEDIAKITDILAN5.png'] },
      { name: 'Galería Web', desc: 'Sistema de gestión de imágenes full-stack.', tags: ['Full Stack', 'Media'], href: 'https://github.com/OnlyAlayy/GaleriaPublica', images: ['/projects/SELEGALLERY.png', '/projects/SELEGALLERY1.png', '/projects/SELEGALLERY2.png', '/projects/SELEGALLERY3.png'] },
    ],
    experience: [
      {
        role: 'Desarrollador Full Stack',
        company: 'ValPostress',
        period: 'Abril 2026 · 1 mes',
        location: 'Montevideo, Uruguay · Remoto',
        desc: 'Lideré arquitectura y desarrollo completo del catálogo digital Val Postress. Plataforma de estilo editorial premium con React.js y Node.js/Express. Seguridad avanzada (Helmet, Rate Limiting, CORS) y despliegue CI/CD en Vercel + Render.',
      },
      {
        role: 'Web Full Stack',
        company: 'Taller Paradise',
        period: 'Jul 2025 – Nov 2025 · 5 meses',
        location: 'Freelance',
        desc: 'SPA personalizada para estudio de arte y tienda de materiales. Frontend en React + Tailwind + Framer Motion. Backend con Node.js, Express y MongoDB. E-commerce integrado con WhatsApp API y automatizaciones con EmailJS y Twilio.',
      },
      {
        role: 'Pasante de Desarrollo',
        company: 'Municipalidad de Avellaneda',
        period: 'May 2025 – Jun 2025 · 2 meses',
        location: 'Avellaneda, Buenos Aires',
        desc: 'Desarrollo de aplicación municipal con React.js y Node.js. Implementación de componentes responsivos, metodologías ágiles con Trello y transformación de diseños Figma en interfaces funcionales.',
      },
    ],
    certifications: [
      { name: 'Model Context Protocol (MCP): Advanced & Intro — Anthropic', url: 'https://verify.skilljar.com/c/v2z6en3z9q46' },
      { name: 'Claude with Google Cloud Vertex AI — Anthropic', url: 'https://verify.skilljar.com/c/7bs5zkp2bd2h' },
      { name: 'Claude with Amazon Bedrock — Anthropic', url: 'https://verify.skilljar.com/c/678rozj8uydd' },
      { name: 'Building with the Claude API — Anthropic', url: 'https://verify.skilljar.com/c/975vbzoecqee' },
      { name: 'Claude Code in Action & Subagents — Anthropic', url: 'https://verify.skilljar.com/c/iv95tsrib29d' },
      { name: 'Introduction to Claude Cowork & Agent Skills — Anthropic', url: 'https://verify.skilljar.com/c/98ui9836ryyn' },
      { name: 'Teaching the AI Fluency Framework — Anthropic', url: 'https://verify.skilljar.com/c/hzu4y67oprji' },
      { name: 'AI Fluency (Foundations, Educators, Students, Nonprofits) — Anthropic', url: 'https://verify.skilljar.com/c/z8z2zv5byhok' },
      { name: 'Claude 101 — Anthropic', url: 'https://verify.skilljar.com/c/q76cwnvwngqa' },
      { name: 'Getting Started with AI on Jetson Nano — NVIDIA', url: '' },
      { name: 'EF SET — Inglés B2 Intermedio Alto (51/100)', url: '' },
    ],
  },
  en: {
    // Nav
    navProjects: 'Projects',
    navExperience: 'Experience',
    navContact: 'Contact',

    // Hero
    available: 'Available for projects',
    location: 'Avellaneda, Buenos Aires, Argentina',
    heroTitle1: 'Programmer Technician · ',
    heroTitle2: 'Full Stack',
    heroTitle3: ' Developer (React/Node.js) with',
    heroTitle4: 'Artificial Intelligence',
    heroSub: '7 years of specialized technical training. Real-world experience in production products, internships, and freelance projects. AI certified by Anthropic.',
    ctaProjects: 'View projects',
    ctaContact: 'Get in touch',

    // About
    aboutLabel: 'About me',
    aboutHeading: 'I build web products\nthat actually work.',
    aboutP1: 'Full Stack Developer with 7 years of technical education at E.E.S.T. N°7. I combine real-world freelance experience with structured knowledge across multiple languages, frameworks, and databases. I prioritize clean code, solid UX, and scalable solutions.',
    aboutP2: 'I am continuously advancing in the AI ecosystem — I hold certifications from Anthropic (Claude, Amazon Bedrock, Google Vertex AI) and apply advanced Prompt Engineering and structured methodologies in my daily workflow.',
    certsLabel: 'Certifications',

    // Projects
    portfolioLabel: 'Portfolio',
    portfolioHeading: 'Featured projects',
    stackLabel: 'Tech Stack',
    viewAll: 'View all on GitHub',

    // Experience
    expLabel: 'Career',
    expHeading: 'Experience',
    eduRole: 'Programmer Technician',
    eduCompany: 'E.E.S.T. N°7 "José Hernández"',
    eduPeriod: 'Mar 2019 – Nov 2025 · 7 years',
    eduDesc: 'Specialized technical training in software development. Structured foundation in multiple programming languages, databases, and software development best practices.',

    // Contact
    contactLabel: 'Contact',
    contactHeading: 'Have a project in mind?',
    contactSub: 'I am available for freelance projects and job opportunities. Reach out and let\'s talk.',

    // Footer
    footerRights: '© 2026 Matías Ojeda Ferreyra',

    // Projects data
    projects: [
      {
        name: 'SINTAX-AI (Auditor)',
        description: 'Full-Stack corporate call auditing SaaS. Audio processing with AssemblyAI (diarization) and Gemini AI for performance evaluation. React frontend with interactive dashboards (Recharts), audio waveforms, and real-time websockets.',
        tags: ['React', 'Node.js', 'Gemini', 'AssemblyAI'],
        accent: 'rgba(167,139,250,0.5)',
        href: 'https://github.com/OnlyAlayy/SINTAX-AI',
        span: 'md:col-span-7',
      },
      {
        name: 'Jarvis',
        description: 'Personal AI voice assistant. Wake word detection, WhatsApp integration, Windows system control, offline TTS (Piper), vision module, home automation, and local semantic file search (RAG).',
        tags: ['Python', 'AI', 'WhatsApp API', 'RAG'],
        accent: 'rgba(96,165,250,0.5)',
        href: 'https://github.com/OnlyAlayy/Jarvis',
        span: 'md:col-span-5',
      },
      {
        name: 'Taller Paradise',
        description: 'Full SPA for an art studio: e-commerce with WhatsApp API, admin panel, and automations with Twilio & EmailJS. React + Node.js + MongoDB.',
        tags: ['React', 'Node.js', 'MongoDB', 'Twilio'],
        accent: 'rgba(52,211,153,0.5)',
        href: 'https://taller-paradise.vercel.app',
        span: 'md:col-span-5',
        images: ['/projects/TALLERPARADISE.png', '/projects/TALLERPARADISE2.png', '/projects/TALLERPARADISE3.png', '/projects/TALLERPARADISE4.png']
      },
      {
        name: 'CatalogoVal',
        description: 'Premium editorial-style digital catalog for Val Postress. Full-stack architecture with advanced security (Helmet, Rate Limiting, CORS) y CI/CD en Vercel + Render.',
        tags: ['Full Stack', 'Security', 'CI/CD'],
        accent: 'rgba(251,191,36,0.4)',
        href: 'https://val-postress.vercel.app',
        span: 'md:col-span-7',
        images: ['/projects/VALPOSTRES.png', '/projects/VALPOSTRES1.png', '/projects/VALPOSTRES2.png', '/projects/VALPOSTRES4.png', '/projects/VALPOSTRES5.png', '/projects/VALPOSTRES6.png']
      },
    ],
    secondaryProjects: [
      { name: 'Turrs Tienda', desc: 'E-commerce with React, Node.js and MongoDB.', tags: ['React', 'MongoDB'], href: 'https://github.com/OnlyAlayy/turrs-tienda', images: ['/projects/TURRSTIENDA1.png', '/projects/TURRSTIENDA2.png', '/projects/TURRSTIENDA3.png', '/projects/TURRSTIENDA4.png'] },
      { name: 'Media Kit Dilan', desc: 'Bilingual web portfolio using Framer Motion.', tags: ['React', 'Framer'], href: 'https://github.com/OnlyAlayy/MediaKit', images: ['/projects/MEDIAKITDILAN.png', '/projects/MEDIAKITDILAN2.png', '/projects/MEDIAKITDILAN3.png', '/projects/MEDIAKITDILAN4.png', '/projects/MEDIAKITDILAN5.png'] },
      { name: 'Web Gallery', desc: 'Full-stack image management system.', tags: ['Full Stack', 'Media'], href: 'https://github.com/OnlyAlayy/GaleriaPublica', images: ['/projects/SELEGALLERY.png', '/projects/SELEGALLERY1.png', '/projects/SELEGALLERY2.png', '/projects/SELEGALLERY3.png'] },
    ],
    experience: [
      {
        role: 'Full Stack Developer',
        company: 'Departamento',
        period: 'April 2026 · 1 month',
        location: 'Montevideo, Uruguay · Remote',
        desc: 'Led the full architecture and development of the Val Postress digital catalog. Premium editorial-style platform built with React.js and Node.js/Express. Advanced security (Helmet, Rate Limiting, CORS) and CI/CD deployment on Vercel + Render.',
      },
      {
        role: 'Full Stack Web Developer',
        company: 'Taller Paradise',
        period: 'Jul 2025 – Nov 2025 · 5 months',
        location: 'Freelance',
        desc: 'Custom SPA for an art studio and materials shop. Frontend with React + Tailwind + Framer Motion. Backend with Node.js, Express, and MongoDB. E-commerce integrated with WhatsApp API and automations via EmailJS and Twilio.',
      },
      {
        role: 'Development Intern',
        company: 'Municipality of Avellaneda',
        period: 'May 2025 – Jun 2025 · 2 months',
        location: 'Avellaneda, Buenos Aires',
        desc: 'Developed a municipal web app using React.js and Node.js. Built responsive components, applied agile methodologies with Trello, and translated Figma designs into functional interfaces.',
      },
    ],
    certifications: [
      { name: 'Model Context Protocol (MCP): Advanced & Intro — Anthropic', url: 'https://verify.skilljar.com/c/v2z6en3z9q46' },
      { name: 'Claude with Google Cloud Vertex AI — Anthropic', url: 'https://verify.skilljar.com/c/7bs5zkp2bd2h' },
      { name: 'Claude with Amazon Bedrock — Anthropic', url: 'https://verify.skilljar.com/c/678rozj8uydd' },
      { name: 'Building with the Claude API — Anthropic', url: 'https://verify.skilljar.com/c/975vbzoecqee' },
      { name: 'Claude Code in Action & Subagents — Anthropic', url: 'https://verify.skilljar.com/c/iv95tsrib29d' },
      { name: 'Introduction to Claude Cowork & Agent Skills — Anthropic', url: 'https://verify.skilljar.com/c/98ui9836ryyn' },
      { name: 'Teaching the AI Fluency Framework — Anthropic', url: 'https://verify.skilljar.com/c/hzu4y67oprji' },
      { name: 'AI Fluency (Foundations, Educators, Students, Nonprofits) — Anthropic', url: 'https://verify.skilljar.com/c/z8z2zv5byhok' },
      { name: 'Claude 101 — Anthropic', url: 'https://verify.skilljar.com/c/q76cwnvwngqa' },
      { name: 'Getting Started with AI on Jetson Nano — NVIDIA', url: '' },
      { name: 'EF SET — English B2 Upper-Intermediate (51/100)', url: '' },
    ],
  },
};
