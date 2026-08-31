import React, { useState, useEffect, useRef } from 'react';
import Chatbot from './components/Chatbot';
import {
  Mail, ArrowUpRight, ChevronRight,
  MapPin, GraduationCap, Briefcase, Award, ExternalLink, Menu, X
} from 'lucide-react';
import { t, type Lang } from './data/translations';

/* ─── Scroll Reveal ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.07 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({
  children, className = '', delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(15px)',
      transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
    }}>
      {children}
    </div>
  );
}

function Typewriter({ parts }: { parts: { text: string; className?: string }[] }) {
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const totalChars = parts.reduce((acc, p) => acc + (p.text?.length || 0), 0);
    if (charIndex < totalChars) {
      const timer = setTimeout(() => setCharIndex(c => c + 1), 20);
      return () => clearTimeout(timer);
    }
  }, [charIndex, parts]);

  let charsToRender = charIndex;
  return (
    <p className="text-base md:text-lg text-zinc-300 max-w-xl leading-relaxed mb-3 font-light min-h-[56px]">
      {/* Screen version (Typing effect) */}
      <span className="print:hidden">
        {parts.map((p, i) => {
          if (charsToRender <= 0 || !p.text) return null;
          const currentText = p.text.slice(0, charsToRender);
          charsToRender -= p.text.length;
          return (
            <span key={i} className={p.className}>
              {currentText}
            </span>
          );
        })}
        {charIndex < parts.reduce((acc, p) => acc + (p.text?.length || 0), 0) && (
          <span className="inline-block w-1.5 h-[1.1em] bg-zinc-400 ml-1 translate-y-[2px] animate-pulse" />
        )}
      </span>
      {/* Print version (Full text instantly) */}
      <span className="hidden print:inline">
        {parts.map((p, i) => (
          <span key={i} className={p.className}>{p.text}</span>
        ))}
      </span>
    </p>
  );
}

/* ─── Image Slider ─── */
function ProjectImageSlider({ images, alt }: { images: string[]; alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((c) => (c + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [images]);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((c) => (c + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((c) => (c - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="absolute inset-0 z-0 bg-zinc-900 overflow-hidden group/slider">
      {images.map((img, i) => (
        <img
          key={img}
          src={img}
          alt={`${alt} ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
            i === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
      ))}

      {images.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
          <button 
            onClick={prevImage}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all z-20 border border-white/10"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
          <button 
            onClick={nextImage}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all z-20 border border-white/10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
          {images.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── SVG Icons ─── */
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const TiktokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

/* ─── Skills data (with devicon classes) ─── */
const skillGroups = [
  {
    label: 'Frontend',
    color: 'rgba(167,139,250,0.06)',
    skills: [
      { name: 'React', icon: 'devicon-react-original colored' },
      { name: 'TypeScript', icon: 'devicon-typescript-plain colored' },
      { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-plain colored' },
      { name: 'Vite', icon: 'devicon-vitejs-plain colored' },
      { name: 'Figma', icon: 'devicon-figma-plain colored' },
    ],
  },
  {
    label: 'Backend',
    color: 'rgba(96,165,250,0.06)',
    skills: [
      { name: 'Node.js', icon: 'devicon-nodejs-plain colored' },
      { name: 'Python', icon: 'devicon-python-plain colored' },
      { name: 'Express', icon: 'devicon-express-original' },
      { name: 'MongoDB', icon: 'devicon-mongodb-plain colored' },
      { name: 'MySQL', icon: 'devicon-mysql-plain colored' },
      { name: 'Supabase', icon: 'devicon-supabase-plain colored' },
      { name: 'NeonDB', icon: null, label: 'NDB' },
      { name: 'Git', icon: 'devicon-git-plain colored' },
      { name: 'Vercel', icon: 'devicon-vercel-plain' },
    ],
  },
  {
    label: 'AI & Tools',
    color: 'rgba(52,211,153,0.06)',
    skills: [
      { name: 'Gemini API', icon: 'devicon-google-plain colored', label: 'GEM' },
      { name: 'RAG Systems', icon: null, label: 'RAG' },
      { name: 'Prompt Eng.', icon: null, label: 'PRO' },
      { name: 'Claude API', icon: null, label: 'CLX' },
      { name: 'MCP', icon: null, label: 'MCP' },
      { name: 'Antigravity', icon: null, label: 'AGV' },
    ],
  },
];

const techMarquee = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Express', 'MongoDB',
  'Tailwind CSS', 'Gemini AI', 'RAG Systems', 'WhatsApp API',
  'Vite', 'Vercel', 'Render', 'Git', 'Figma', 'Twilio', 'MCP', 'Antigravity'
];

/* ─── App ─── */
export default function App() {
  const year = new Date().getFullYear();
  const [lang, setLang] = useState<Lang>('es');
  const l = t[lang];
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0, rootMargin: '-30% 0px -30% 0px' });

    document.querySelectorAll('section[id]').forEach(sec => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
  };

  const heroStyle = (delay: number) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(22px)',
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  return (
    <div className="noise grid-bg min-h-screen relative">

      {/* ── Aurora blobs ── */}
      <div className="aurora-wrap" aria-hidden="true">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>

      {/* ── Nav ── */}
      <nav className="fixed top-0 w-full z-40 nav-bar">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight text-zinc-300">
            Alay<span className="text-zinc-500">.</span>Dev
          </span>
          <div className="hidden md:flex items-center gap-8">
            <a href="#projects" className={`nav-link text-xs uppercase tracking-widest transition-all duration-700 ease-out ${activeSection === 'projects' ? 'text-zinc-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'text-zinc-500 hover:text-zinc-300'}`} style={{ fontFamily: "'Geist Mono', monospace" }}>{l.navProjects}</a>
            <a href="#experience" className={`nav-link text-xs uppercase tracking-widest transition-all duration-700 ease-out ${activeSection === 'experience' ? 'text-zinc-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'text-zinc-500 hover:text-zinc-300'}`} style={{ fontFamily: "'Geist Mono', monospace" }}>{l.navExperience}</a>
            <a href="#contact" className={`nav-link text-xs uppercase tracking-widest transition-all duration-700 ease-out ${activeSection === 'contact' ? 'text-zinc-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'text-zinc-500 hover:text-zinc-300'}`} style={{ fontFamily: "'Geist Mono', monospace" }}>{l.navContact}</a>
          </div>
          <div className="flex items-center gap-1">
            {/* Language toggle */}
            <div className="flex items-center bg-[#050505] border border-white/10 rounded-full p-0.5 mr-3 relative">
              <div
                className="absolute top-0.5 bottom-0.5 w-8 bg-white/10 rounded-full transition-transform duration-300 ease-out"
                style={{ transform: lang === 'es' ? 'translateX(0)' : 'translateX(100%)' }}
              />
              <button onClick={() => setLang('es')}
                className={`relative w-8 h-6 flex items-center justify-center text-[10px] font-bold tracking-wider transition-colors duration-300 z-10 ${lang === 'es' ? 'text-white' : 'text-zinc-300 hover:text-zinc-300'}`}>
                ES
              </button>
              <button onClick={() => setLang('en')}
                className={`relative w-8 h-6 flex items-center justify-center text-[10px] font-bold tracking-wider transition-colors duration-300 z-10 ${lang === 'en' ? 'text-white' : 'text-zinc-300 hover:text-zinc-300'}`}>
                EN
              </button>
            </div>
            <a href="https://github.com/OnlyAlayy" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
              className="hidden md:flex p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-all">
              <GithubIcon className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/matias-ojeda-ferreyra" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="hidden md:flex p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-all">
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/alaybuilds?igsh=ZjM4dWtjaWFrMXly" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="hidden md:flex p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-all">
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a href="https://www.tiktok.com/@alaydev?_r=1&_t=ZS-96zyapOsf3v" target="_blank" rel="noopener noreferrer" aria-label="TikTok"
              className="hidden md:flex p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-all">
              <TiktokIcon className="w-4 h-4" />
            </a>
            <a href="#contact"
              className="hidden md:flex ml-2 mono-label text-zinc-400 border border-zinc-800 rounded-full px-4 py-1.5 hover:text-zinc-200 hover:border-zinc-600 transition-all"
              style={{ fontSize: '11px' }}>
              {l.navContact}
            </a>
            <button onClick={() => window.print()}
              className="hidden md:flex ml-2 mono-label text-zinc-900 bg-zinc-100 border border-transparent rounded-full px-4 py-1.5 hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all font-medium cursor-pointer"
              style={{ fontSize: '11px' }}>
              {l.navDownloadCV}
            </button>
            <button 
              className="md:hidden p-2 text-zinc-400 hover:text-zinc-200 transition-colors ml-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {/* Mobile menu panel */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#050505]/95 backdrop-blur-xl">
            <div className="flex flex-col px-6 py-4 gap-4">
              <a href="#projects" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-zinc-300 hover:text-white uppercase tracking-widest">{l.navProjects}</a>
              <a href="#experience" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-zinc-300 hover:text-white uppercase tracking-widest">{l.navExperience}</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-zinc-300 hover:text-white uppercase tracking-widest">{l.navContact}</a>
              <button onClick={() => { setIsMenuOpen(false); setTimeout(() => window.print(), 300); }} className="text-sm font-medium text-zinc-900 bg-zinc-100 hover:bg-white text-center py-2 rounded-md uppercase tracking-widest mt-2 cursor-pointer">{l.navDownloadCV}</button>
              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <a href="https://github.com/OnlyAlayy" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-200"><GithubIcon className="w-5 h-5" /></a>
                <a href="https://www.linkedin.com/in/matias-ojeda-ferreyra" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-200"><LinkedinIcon className="w-5 h-5" /></a>
                <a href="https://www.instagram.com/alaybuilds?igsh=ZjM4dWtjaWFrMXly" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-200"><InstagramIcon className="w-5 h-5" /></a>
                <a href="https://www.tiktok.com/@alaydev?_r=1&_t=ZS-96zyapOsf3v" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-200"><TiktokIcon className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-6xl mx-auto px-6 relative z-10">

        {/* ── Hero ── */}
        <section className="min-h-[100dvh] flex flex-col pt-32 md:pt-20 pb-20 justify-center">
          <div className="grid md:grid-cols-[1fr_auto] gap-12 items-center">

            {/* Left: Text */}
            <div>
              <div style={heroStyle(0.2)}>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-3 h-3 text-zinc-500" />
                  <span className="mono-label">{l.location}</span>
                </div>
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.87] mb-8">
                  <span className="text-zinc-100">Matías</span><br />
                  <span className="gradient-text">Ojeda</span><br />
                  <span className="text-zinc-400">Ferreyra.</span>
                </h1>
              </div>

              <div style={heroStyle(0.35)}>
                <Typewriter parts={[
                  { text: l.heroTitle1 + ' ' },
                  { text: l.heroTitle2, className: 'font-semibold text-zinc-200' },
                  { text: ' ' + l.heroTitle3 + ' ' },
                  { text: l.heroTitle4 + '.', className: 'font-bold text-zinc-100' }
                ]} />
                <p className="text-sm text-zinc-500 max-w-lg leading-relaxed mb-10"
                  style={{ fontFamily: "'Geist Mono', monospace", fontSize: '12px' }}>
                  {l.heroSub}
                </p>
              </div>

              <div style={heroStyle(0.45)}>
                <div className="flex flex-wrap gap-3 mb-6">
                  <a href="#projects" className="btn-primary">
                    {l.ctaProjects} <ChevronRight className="w-4 h-4" />
                  </a>
                  <a href="mailto:ojedaferreyramatias@gmail.com" className="btn-ghost">
                    <Mail className="w-4 h-4" /> {l.ctaContact}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-zinc-300 pl-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-medium">{l.available}</span>
                </div>
              </div>
            </div>

            {/* Right: Profile photo */}
            <div style={heroStyle(0.15)} className="flex items-center justify-center mt-4 md:mt-0">
              <div className="profile-photo-wrap">
                <div className="profile-photo-inner">
                  <img
                    src="/fotoperfilcv.png"
                    alt="Foto de perfil de Matías Ojeda Ferreyra"
                    className="profile-photo-img"
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Tech Marquee ── */}
        <div className="py-10 overflow-hidden" style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div className="marquee-track">
            {[...techMarquee, ...techMarquee, ...techMarquee, ...techMarquee].map((tech, i) => (
              <span key={i} className="flex items-center gap-3 mx-6 select-none"
                style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10px', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <span className="w-1 h-1 rounded-full bg-zinc-800 flex-shrink-0" />
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="section-divider" />

        {/* ── About ── */}
        <section id="about" className="py-20">
          <Reveal>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="about-card">
                <p className="section-tag">{l.aboutLabel}</p>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100 mb-5 leading-tight">
                  {l.aboutHeading.split('\n').map((line, i) => (
                    <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>
                  ))}
                </h2>
                <p className="text-sm text-zinc-300 leading-relaxed mb-4">{l.aboutP1}</p>
                <p className="text-sm text-zinc-400 leading-relaxed">{l.aboutP2}</p>
              </div>
              <div className="relative flex flex-col h-[340px]">
                <div className="pb-4 flex-shrink-0">
                  <p className="section-tag">{l.certsLabel}</p>
                </div>

                <div className="relative flex-grow overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-[#050505] to-transparent z-10 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />

                  <div className="h-full overflow-y-auto pr-2 custom-scrollbar space-y-2 pb-8">
                    {l.certifications.map((cert, i) => (
                      <Reveal key={i} delay={i * 0.035}>
                        {cert.url ? (
                          <a href={cert.url} target="_blank" rel="noopener noreferrer" className="cert-row flex items-start gap-3 p-3 group block relative">
                            <Award className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0 mt-0.5 group-hover:text-zinc-300 transition-colors" />
                            <span className="text-xs text-zinc-300 leading-snug pr-4 group-hover:text-zinc-300 transition-colors"
                              style={{ fontFamily: "'Geist Mono', monospace" }}>
                              {cert.name}
                            </span>
                            <ExternalLink className="w-3 h-3 text-zinc-500 absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ) : (
                          <div className="cert-row flex items-start gap-3 p-3">
                            <Award className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-zinc-300 leading-snug"
                              style={{ fontFamily: "'Geist Mono', monospace" }}>{cert.name}</span>
                          </div>
                        )}
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <div className="section-divider" />

        {/* ── Skills visual ── */}
        <section className="py-20">
          <Reveal>
            <p className="section-tag mb-8">{l.stackLabel}</p>
            <div className="space-y-8">
              {skillGroups.map((group, gi) => (
                <div key={group.label}>
                  <p className="skill-group-label mb-3">{group.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((sk, si) => (
                      <Reveal key={sk.name} delay={gi * 0.05 + si * 0.04}>
                        <div className="skill-chip" style={{ ['--chip-glow' as string]: group.color }}>
                          {sk.icon
                            ? <i className={`${sk.icon} text-lg`} />
                            : <span className="w-[28px] h-5 rounded flex-shrink-0 flex items-center justify-center bg-white/5 border border-white/8"
                              style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', color: '#52525b', letterSpacing: '0.04em' }}>
                              {(sk as { name: string; icon: null; label?: string }).label ?? sk.name.slice(0, 3).toUpperCase()}
                            </span>
                          }
                          <span>{sk.name}</span>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <div className="section-divider" />

        {/* ── Projects ── */}
        <section id="projects" className="py-20">
          <Reveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="section-tag">{l.portfolioLabel}</p>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">{l.portfolioHeading}</h2>
              </div>
              <a href="https://github.com/OnlyAlayy" target="_blank" rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 transition-colors"
                style={{ fontFamily: "'Geist Mono', monospace", fontSize: '11px', color: '#52525b' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#a1a1aa')}
                onMouseLeave={e => (e.currentTarget.style.color = '#52525b')}>
                {l.viewAll} <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 print:block print:space-y-4">
            {l.projects.map((p, i) => (
              <Reveal key={p.name} className={p.span} delay={i * 0.08}>
                <a href={p.href} target="_blank" rel="noopener noreferrer"
                  onMouseMove={handleMouseMove}
                  className="project-card h-full p-6 md:p-8 flex flex-col block group">
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="card-glow" style={{ background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)` }} />
                    <div className="img-placeholder w-full h-44 mb-6 flex items-center justify-center relative overflow-hidden rounded-xl">
                      {/* @ts-ignore */}
                      {p.images ? (
                        <ProjectImageSlider images={p.images as string[]} alt={p.name} />
                      ) : (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: `radial-gradient(ellipse at 50% 100%, ${p.accent}33 0%, transparent 70%)`,
                        }} />
                      )}
                      
                      <div className="flex flex-col items-center gap-1.5 z-10 transition-opacity duration-300 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 shadow-2xl border border-white/10" style={{ color: 'white' }}>
                        <ExternalLink className="w-4 h-4" />
                        <span className="uppercase tracking-widest font-bold" style={{ fontSize: '10px', color: 'white' }}>Preview</span>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold tracking-tight text-zinc-100">{p.name}</h3>
                        <ArrowUpRight className="w-4 h-4 text-zinc-500 arrow-icon flex-shrink-0 mt-0.5" />
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed mb-5 flex-1">{p.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {p.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                      </div>
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 print:block print:space-y-4">
              {l.secondaryProjects.map(p => (
                <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer"
                  onMouseMove={handleMouseMove}
                  className="project-card p-5 flex flex-col block group">
                  <div className="relative z-10 flex flex-col h-full">
                    {/* @ts-ignore */}
                    {p.images && (
                      <div className="w-full h-32 mb-4 rounded-lg overflow-hidden border border-white/5 relative">
                        {/* @ts-ignore */}
                        <ProjectImageSlider images={p.images as string[]} alt={p.name} />
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-1.5">
                      <h3 className="text-sm font-semibold text-zinc-200">{p.name}</h3>
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 arrow-icon flex-shrink-0 mt-0.5" />
                    </div>
                    <p className="text-xs text-zinc-400 mb-4 flex-1">{p.desc}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {p.tags.map(tag => (
                        <span key={tag} className="tag" style={{ fontSize: '9px', padding: '2px 8px' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>
        </section>

        <div className="section-divider" />

        {/* ── Experience ── */}
        <section id="experience" className="py-20">
          <Reveal>
            <p className="section-tag">{l.expLabel}</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100 mb-10">{l.expHeading}</h2>
          </Reveal>

          <div className="space-y-2">
            {l.experience.map((e, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="exp-row" onMouseMove={handleMouseMove}>
                  <div className="flex items-start gap-4 py-6 px-5 relative z-10">
                    <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-1">
                      {i === 0
                        ? <div className="exp-dot-active" />
                        : <div className="exp-dot" />
                      }
                    </div>
                    <div className="w-8 h-8 rounded-lg exp-icon flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                        <div>
                          <h3 className="text-sm font-semibold text-zinc-200">{e.role}</h3>
                          <p className="text-xs font-medium text-zinc-300"
                            style={{ fontFamily: "'Geist Mono', monospace" }}>{e.company}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="mono-label whitespace-nowrap">{e.period}</p>
                          <p className="mono-label whitespace-nowrap" style={{ marginTop: '2px' }}>{e.location}</p>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{e.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.3}>
              <div className="exp-row" onMouseMove={handleMouseMove}>
                <div className="flex items-start gap-4 py-6 px-5 relative z-10">
                  <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-1">
                    <div className="exp-dot" />
                  </div>
                  <div className="w-8 h-8 rounded-lg exp-icon flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-200">{l.eduRole}</h3>
                        <p className="text-xs font-medium text-zinc-300"
                          style={{ fontFamily: "'Geist Mono', monospace" }}>{l.eduCompany}</p>
                      </div>
                      <p className="mono-label whitespace-nowrap">{l.eduPeriod}</p>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{l.eduDesc}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── Contact ── */}
        <section id="contact" className="py-20 pb-32">
          <Reveal>
            <div className="text-center max-w-lg mx-auto">
              <p className="section-tag justify-center mb-5">{l.contactLabel}</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-100 mb-4 leading-tight">
                {l.contactHeading}
              </h2>
              <p className="text-sm text-zinc-400 mb-10 leading-relaxed"
                style={{ fontFamily: "'Geist Mono', monospace", fontSize: '12px' }}>
                {l.contactSub}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
                <a href="mailto:ojedaferreyramatias@gmail.com" className="btn-primary">
                  <Mail className="w-4 h-4" /> ojedaferreyramatias@gmail.com
                </a>
              </div>
              <div className="flex justify-center gap-6">
                <a href="https://www.linkedin.com/in/matias-ojeda-ferreyra" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  style={{ fontFamily: "'Geist Mono', monospace", fontSize: '11px' }}>
                  <LinkedinIcon className="w-3.5 h-3.5" /> LinkedIn
                </a>
                <a href="https://github.com/OnlyAlayy" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  style={{ fontFamily: "'Geist Mono', monospace", fontSize: '11px' }}>
                  <GithubIcon className="w-3.5 h-3.5" /> GitHub
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>


      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }} className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '11px', color: '#3f3f46' }}>
            © {year} Alay Dev
          </span>
          <div className="flex items-center gap-4">
            <a href="https://github.com/OnlyAlayy" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
              className="text-zinc-800 hover:text-zinc-300 transition-colors">
              <GithubIcon className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.linkedin.com/in/matias-ojeda-ferreyra" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="text-zinc-800 hover:text-zinc-300 transition-colors">
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.instagram.com/alaybuilds?igsh=ZjM4dWtjaWFrMXly" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="text-zinc-800 hover:text-zinc-300 transition-colors">
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.tiktok.com/@alaydev?_r=1&_t=ZS-96zyapOsf3v" target="_blank" rel="noopener noreferrer" aria-label="TikTok"
              className="text-zinc-800 hover:text-zinc-300 transition-colors">
              <TiktokIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
}
