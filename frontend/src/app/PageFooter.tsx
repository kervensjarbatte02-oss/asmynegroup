"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube, FaWhatsapp, FaGlobe } from "react-icons/fa";

type FooterTheme = {
  bg: string;
  text: string;
  muted: string;
  border: string;
  logoBadgeBg: string;
  logoBadgeText: string;
  inputBg: string;
  inputText: string;
  inputPlaceholder: string;
  actionBg: string;
  actionText: string;
  actionHover: string;
  linkHover: string;
  socialHover: string;
  topBtnBg: string;
  topBtnText: string;
  topBtnHover: string;
};

type FooterNavLink = {
  label: string;
  href: string;
};

type FooterRouteLinks = {
  services: FooterNavLink[];
  quickLinks: FooterNavLink[];
};

const darkTheme: FooterTheme = {
  bg: "bg-[#0a174e]",
  text: "text-white",
  muted: "text-white/80",
  border: "border-white/10",
  logoBadgeBg: "bg-[#e6e85c]",
  logoBadgeText: "text-[#16213a]",
  inputBg: "bg-white",
  inputText: "text-[#111216]",
  inputPlaceholder: "placeholder:text-[#4b5563]",
  actionBg: "bg-white",
  actionText: "text-[#111216]",
  actionHover: "hover:bg-[#e6e85c]",
  linkHover: "hover:text-[#e6e85c]",
  socialHover: "hover:text-white",
  topBtnBg: "bg-[#e6e85c]",
  topBtnText: "text-[#16213a]",
  topBtnHover: "hover:bg-[#ffe082]",
};

const lightTheme: FooterTheme = {
  bg: "bg-[#f8fafc]",
  text: "text-[#0f172a]",
  muted: "text-[#334155]",
  border: "border-[#cbd5e1]",
  logoBadgeBg: "bg-[#0f172a]",
  logoBadgeText: "text-white",
  inputBg: "bg-white",
  inputText: "text-[#0f172a]",
  inputPlaceholder: "placeholder:text-[#64748b]",
  actionBg: "bg-[#0f172a]",
  actionText: "text-white",
  actionHover: "hover:bg-[#1e293b]",
  linkHover: "hover:text-[#0b5ed7]",
  socialHover: "hover:text-[#0f172a]",
  topBtnBg: "bg-[#0f172a]",
  topBtnText: "text-white",
  topBtnHover: "hover:bg-[#1e293b]",
};

const goldTheme: FooterTheme = {
  bg: "bg-[#f7e1b5]",
  text: "text-[#2d2a1f]",
  muted: "text-[#4b3f27]",
  border: "border-[#c9a86a]",
  logoBadgeBg: "bg-[#2d2a1f]",
  logoBadgeText: "text-[#f7e1b5]",
  inputBg: "bg-[#fff9ea]",
  inputText: "text-[#2d2a1f]",
  inputPlaceholder: "placeholder:text-[#7a6640]",
  actionBg: "bg-[#2d2a1f]",
  actionText: "text-[#f7e1b5]",
  actionHover: "hover:bg-[#17130b]",
  linkHover: "hover:text-[#8b5a00]",
  socialHover: "hover:text-[#2d2a1f]",
  topBtnBg: "bg-[#2d2a1f]",
  topBtnText: "text-[#f7e1b5]",
  topBtnHover: "hover:bg-[#17130b]",
};

const darkMonoTheme: FooterTheme = {
  bg: "bg-black",
  text: "text-[#ececf1]",
  muted: "text-[#c1c5d1]",
  border: "border-[#343541]",
  logoBadgeBg: "bg-[#ececf1]",
  logoBadgeText: "text-black",
  inputBg: "bg-[#23272f]",
  inputText: "text-[#ececf1]",
  inputPlaceholder: "placeholder:text-[#a1a1aa]",
  actionBg: "bg-[#ececf1]",
  actionText: "text-black",
  actionHover: "hover:bg-[#d4d4d8]",
  linkHover: "hover:text-white",
  socialHover: "hover:text-white",
  topBtnBg: "bg-[#ececf1]",
  topBtnText: "text-black",
  topBtnHover: "hover:bg-[#d4d4d8]",
};

const pinkTheme: FooterTheme = {
  bg: "bg-pink-500",
  text: "text-white",
  muted: "text-pink-50",
  border: "border-pink-300",
  logoBadgeBg: "bg-white",
  logoBadgeText: "text-pink-600",
  inputBg: "bg-pink-50",
  inputText: "text-pink-900",
  inputPlaceholder: "placeholder:text-pink-400",
  actionBg: "bg-white",
  actionText: "text-pink-600",
  actionHover: "hover:bg-pink-100",
  linkHover: "hover:text-pink-100",
  socialHover: "hover:text-pink-100",
  topBtnBg: "bg-white",
  topBtnText: "text-pink-600",
  topBtnHover: "hover:bg-pink-100",
};

const blueTheme: FooterTheme = {
  bg: "bg-blue-900",
  text: "text-blue-100",
  muted: "text-blue-200",
  border: "border-blue-700",
  logoBadgeBg: "bg-blue-200",
  logoBadgeText: "text-blue-900",
  inputBg: "bg-blue-50",
  inputText: "text-blue-900",
  inputPlaceholder: "placeholder:text-blue-500",
  actionBg: "bg-blue-100",
  actionText: "text-blue-900",
  actionHover: "hover:bg-white",
  linkHover: "hover:text-white",
  socialHover: "hover:text-white",
  topBtnBg: "bg-blue-100",
  topBtnText: "text-blue-900",
  topBtnHover: "hover:bg-white",
};

const deepNightGoldTheme: FooterTheme = {
  bg: "bg-[#16213e]",
  text: "text-[#ffd700]",
  muted: "text-[#ffe38a]",
  border: "border-[#ffd700]/40",
  logoBadgeBg: "bg-[#ffd700]",
  logoBadgeText: "text-[#16213e]",
  inputBg: "bg-[#fef3c7]",
  inputText: "text-[#16213e]",
  inputPlaceholder: "placeholder:text-[#6b7280]",
  actionBg: "bg-[#ffd700]",
  actionText: "text-[#16213e]",
  actionHover: "hover:bg-yellow-300",
  linkHover: "hover:text-white",
  socialHover: "hover:text-white",
  topBtnBg: "bg-[#ffd700]",
  topBtnText: "text-[#16213e]",
  topBtnHover: "hover:bg-yellow-300",
};

const creamBusinessTheme: FooterTheme = {
  bg: "bg-[#fffbe6]",
  text: "text-[#0a174e]",
  muted: "text-[#334155]",
  border: "border-[#e6b85c]",
  logoBadgeBg: "bg-[#0a174e]",
  logoBadgeText: "text-[#fffbe6]",
  inputBg: "bg-white",
  inputText: "text-[#0a174e]",
  inputPlaceholder: "placeholder:text-[#64748b]",
  actionBg: "bg-[#0a174e]",
  actionText: "text-[#fffbe6]",
  actionHover: "hover:bg-[#1f3a8a]",
  linkHover: "hover:text-[#b8860b]",
  socialHover: "hover:text-[#0a174e]",
  topBtnBg: "bg-[#0a174e]",
  topBtnText: "text-[#fffbe6]",
  topBtnHover: "hover:bg-[#1f3a8a]",
};

const routeThemes: Array<{ matcher: RegExp; theme: FooterTheme }> = [
  {
    matcher: /^\/$/,
    theme: darkTheme,
  },
  {
    matcher: /^\/contact(\/.*)?$/,
    theme: {
      ...darkTheme,
      bg: "bg-[#111827]",
      border: "border-slate-700",
    },
  },
  {
    matcher: /^\/faq(\/.*)?$/,
    theme: {
      ...darkTheme,
      bg: "bg-[#13254d]",
      border: "border-blue-300/30",
    },
  },
  {
    matcher: /^\/blog(\/.*)?$/,
    theme: {
      ...darkTheme,
      text: "text-[#f7df9f]",
      muted: "text-[#f7df9f]/85",
      border: "border-[#e6b85c]/35",
      socialHover: "hover:text-[#f7df9f]",
    },
  },
  {
    matcher: /^\/cart(\/.*)?$/,
    theme: goldTheme,
  },
  {
    matcher: /^\/settings(\/.*)?$/,
    theme: {
      ...darkMonoTheme,
      border: "border-neutral-700",
    },
  },
  {
    matcher: /^\/produit(\/.*)?$/,
    theme: {
      ...goldTheme,
      bg: "bg-yellow-50",
      border: "border-yellow-200",
    },
  },
  {
    matcher: /^\/services\/agence-voyage(\/.*)?$/,
    theme: lightTheme,
  },
  {
    matcher: /^\/services\/hair-solutions(\/.*)?$/,
    theme: goldTheme,
  },
  {
    matcher: /^\/services\/marketplace-global(\/.*)?$/,
    theme: {
      ...lightTheme,
      bg: "bg-gray-50",
      border: "border-gray-200",
    },
  },
  {
    matcher: /^\/services\/chatbot-intelligent(\/.*)?$/,
    theme: darkMonoTheme,
  },
  {
    matcher: /^\/services\/dating(\/.*)?$/,
    theme: pinkTheme,
  },
  {
    matcher: /^\/services\/reseau-social(\/.*)?$/,
    theme: blueTheme,
  },
  {
    matcher: /^\/services\/systeme-monetisation(\/.*)?$/,
    theme: deepNightGoldTheme,
  },
  {
    matcher: /^\/services\/conseil-entrepreneurial(\/.*)?$/,
    theme: creamBusinessTheme,
  },
  {
    matcher: /^\/services\/yontikonsey-blog(\/.*)?$/,
    theme: lightTheme,
  },
  {
    matcher: /^\/services\/[a-z0-9-]+(\/.*)?$/,
    theme: {
      ...darkTheme,
      bg: "bg-[#050c24]",
      text: "text-[#e6b85c]",
      muted: "text-[#e6b85c]/85",
      border: "border-[#e6b85c]/30",
      socialHover: "hover:text-[#e6b85c]",
    },
  },
];

const defaultRouteLinks: FooterRouteLinks = {
  services: [
    { label: "Asesoria Migratoria", href: "/services/conseil-migratoire" },
    { label: "Servicios Empresariales", href: "/services/conseil-entrepreneurial" },
    { label: "Marketplace Global", href: "/services/marketplace-global" },
    { label: "Agencia de Viajes", href: "/services/agence-voyage" },
    { label: "Soluciones Capilares", href: "/services/hair-solutions" },
    { label: "Red Social", href: "/services/reseau-social" },
  ],
  quickLinks: [
    { label: "Inicio", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Contactanos", href: "/contact" },
    { label: "Preguntas Frecuentes", href: "/faq" },
    { label: "Sobre Nosotros", href: "/services" },
    { label: "Devenir Vendeur", href: "/vendor/register" },
  ],
};

const routeLinks: Array<{ matcher: RegExp; links: FooterRouteLinks }> = [
  {
    matcher: /^\/blog(\/.*)?$/,
    links: {
      services: [
        { label: "Yontikonsey Blog", href: "/services/yontikonsey-blog" },
        { label: "Asesoria Migratoria", href: "/services/conseil-migratoire" },
        { label: "Servicios Empresariales", href: "/services/conseil-entrepreneurial" },
        { label: "Marketplace Global", href: "/services/marketplace-global" },
        { label: "Agencia de Viajes", href: "/services/agence-voyage" },
        { label: "Red Social", href: "/services/reseau-social" },
      ],
      quickLinks: [
        { label: "Ultimos articulos", href: "/blog" },
        { label: "Servicios", href: "/services" },
        { label: "Contacto", href: "/contact" },
        { label: "Preguntas frecuentes", href: "/faq" },
        { label: "Inicio", href: "/" },
      ],
    },
  },
  {
    matcher: /^\/contact(\/.*)?$/,
    links: {
      services: defaultRouteLinks.services,
      quickLinks: [
        { label: "Formulario de contacto", href: "/contact" },
        { label: "Soporte 24/7", href: "/contact" },
        { label: "Preguntas Frecuentes", href: "/faq" },
        { label: "Servicios", href: "/services" },
        { label: "Inicio", href: "/" },
      ],
    },
  },
  {
    matcher: /^\/faq(\/.*)?$/,
    links: {
      services: defaultRouteLinks.services,
      quickLinks: [
        { label: "Preguntas Frecuentes", href: "/faq" },
        { label: "Contactanos", href: "/contact" },
        { label: "Servicios", href: "/services" },
        { label: "Blog", href: "/blog" },
        { label: "Inicio", href: "/" },
      ],
    },
  },
  {
    matcher: /^\/cart(\/.*)?$/,
    links: {
      services: [
        { label: "Marketplace Global", href: "/services/marketplace-global" },
        { label: "Sistema de Monetizacion", href: "/services/systeme-monetisation" },
        { label: "Agencia de Viajes", href: "/services/agence-voyage" },
        { label: "Soluciones Capilares", href: "/services/hair-solutions" },
        { label: "Servicios Empresariales", href: "/services/conseil-entrepreneurial" },
        { label: "Asesoria Migratoria", href: "/services/conseil-migratoire" },
      ],
      quickLinks: [
        { label: "Mi carrito", href: "/cart" },
        { label: "Mercado", href: "/marketplace" },
        { label: "Contacto", href: "/contact" },
        { label: "Preguntas frecuentes", href: "/faq" },
        { label: "Inicio", href: "/" },
      ],
    },
  },
  {
    matcher: /^\/services\/agence-voyage(\/.*)?$/,
    links: {
      services: [
        { label: "Agencia de Viajes", href: "/services/agence-voyage" },
        { label: "Asesoria Migratoria", href: "/services/conseil-migratoire" },
        { label: "Marketplace Global", href: "/services/marketplace-global" },
        { label: "Servicios Empresariales", href: "/services/conseil-entrepreneurial" },
        { label: "Sistema de Monetizacion", href: "/services/systeme-monetisation" },
        { label: "Red Social", href: "/services/reseau-social" },
      ],
      quickLinks: [
        { label: "Buscar vuelos", href: "/services/agence-voyage" },
        { label: "Ofertas de viaje", href: "/services/agence-voyage" },
        { label: "Contactanos", href: "/contact" },
        { label: "Preguntas Frecuentes", href: "/faq" },
        { label: "Inicio", href: "/" },
      ],
    },
  },
  {
    matcher: /^\/services\/marketplace-global(\/.*)?$/,
    links: {
      services: [
        { label: "Marketplace Global", href: "/services/marketplace-global" },
        { label: "Sistema de Monetizacion", href: "/services/systeme-monetisation" },
        { label: "Servicios Empresariales", href: "/services/conseil-entrepreneurial" },
        { label: "Agencia de Viajes", href: "/services/agence-voyage" },
        { label: "Soluciones Capilares", href: "/services/hair-solutions" },
        { label: "Red Social", href: "/services/reseau-social" },
      ],
      quickLinks: [
        { label: "Catalogo", href: "/services/marketplace-global" },
        { label: "Proveedores", href: "/services/marketplace-global" },
        { label: "Solicitar cotizacion", href: "/contact" },
        { label: "Preguntas frecuentes", href: "/faq" },
        { label: "Devenir Vendeur", href: "/vendor/register" },
        { label: "Inicio", href: "/" },
      ],
    },
  },
  {
    matcher: /^\/services\/hair-solutions(\/.*)?$/,
    links: {
      services: [
        { label: "Soluciones Capilares", href: "/services/hair-solutions" },
        { label: "Marketplace Global", href: "/services/marketplace-global" },
        { label: "Servicios Empresariales", href: "/services/conseil-entrepreneurial" },
        { label: "Agencia de Viajes", href: "/services/agence-voyage" },
        { label: "Asesoria Migratoria", href: "/services/conseil-migratoire" },
        { label: "Red Social", href: "/services/reseau-social" },
      ],
      quickLinks: [
        { label: "Mas vendidos", href: "/services/hair-solutions" },
        { label: "Preguntas capilares", href: "/services/hair-solutions" },
        { label: "Contactanos", href: "/contact" },
        { label: "Blog", href: "/blog" },
        { label: "Inicio", href: "/" },
      ],
    },
  },
  {
    matcher: /^\/services\/dating(\/.*)?$/,
    links: {
      services: [
        { label: "Citas", href: "/services/dating" },
        { label: "Red Social", href: "/services/reseau-social" },
        { label: "Sistema de Monetizacion", href: "/services/systeme-monetisation" },
        { label: "Marketplace Global", href: "/services/marketplace-global" },
        { label: "Servicios Empresariales", href: "/services/conseil-entrepreneurial" },
        { label: "Asesoria Migratoria", href: "/services/conseil-migratoire" },
      ],
      quickLinks: [
        { label: "Empezar ahora", href: "/services/dating" },
        { label: "Crear perfil", href: "/services/dating" },
        { label: "Contactanos", href: "/contact" },
        { label: "Preguntas frecuentes", href: "/faq" },
        { label: "Inicio", href: "/" },
      ],
    },
  },
  {
    matcher: /^\/services\/reseau-social(\/.*)?$/,
    links: {
      services: [
        { label: "Red Social", href: "/services/reseau-social" },
        { label: "Sistema de Monetizacion", href: "/services/systeme-monetisation" },
        { label: "Citas", href: "/services/dating" },
        { label: "Marketplace Global", href: "/services/marketplace-global" },
        { label: "Servicios Empresariales", href: "/services/conseil-entrepreneurial" },
        { label: "Blog Yontikonsey", href: "/services/yontikonsey-blog" },
      ],
      quickLinks: [
        { label: "Publicar", href: "/services/reseau-social" },
        { label: "Estadisticas", href: "/services/reseau-social" },
        { label: "Comunidad", href: "/services/reseau-social" },
        { label: "Contactanos", href: "/contact" },
        { label: "Inicio", href: "/" },
      ],
    },
  },
  {
    matcher: /^\/services\/systeme-monetisation(\/.*)?$/,
    links: {
      services: [
        { label: "Sistema de Monetizacion", href: "/services/systeme-monetisation" },
        { label: "Servicios Empresariales", href: "/services/conseil-entrepreneurial" },
        { label: "Marketplace Global", href: "/services/marketplace-global" },
        { label: "Red Social", href: "/services/reseau-social" },
        { label: "Citas", href: "/services/dating" },
        { label: "Blog Yontikonsey", href: "/services/yontikonsey-blog" },
      ],
      quickLinks: [
        { label: "Activar monetizacion", href: "/services/systeme-monetisation" },
        { label: "Comparar planes", href: "/services/systeme-monetisation" },
        { label: "Solicitar asesoria", href: "/contact" },
        { label: "Preguntas frecuentes", href: "/faq" },
        { label: "Inicio", href: "/" },
      ],
    },
  },
  {
    matcher: /^\/services\/conseil-entrepreneurial(\/.*)?$/,
    links: {
      services: [
        { label: "Servicios Empresariales", href: "/services/conseil-entrepreneurial" },
        { label: "Sistema de Monetizacion", href: "/services/systeme-monetisation" },
        { label: "Marketplace Global", href: "/services/marketplace-global" },
        { label: "Blog Yontikonsey", href: "/services/yontikonsey-blog" },
        { label: "Red Social", href: "/services/reseau-social" },
        { label: "Asesoria Migratoria", href: "/services/conseil-migratoire" },
      ],
      quickLinks: [
        { label: "Agendar cita", href: "/services/conseil-entrepreneurial" },
        { label: "Nuestras soluciones", href: "/services/conseil-entrepreneurial" },
        { label: "Contactanos", href: "/contact" },
        { label: "Blog", href: "/blog" },
        { label: "Inicio", href: "/" },
      ],
    },
  },
];

function getTheme(pathname: string): FooterTheme {
  const routeTheme = routeThemes.find(({ matcher }) => matcher.test(pathname));

  if (routeTheme) {
    return routeTheme.theme;
  }

  return darkTheme;
}

function getRouteLinks(pathname: string): FooterRouteLinks {
  const matched = routeLinks.find(({ matcher }) => matcher.test(pathname));
  return matched?.links ?? defaultRouteLinks;
}

export default function PageFooter() {
  const pathname = usePathname() || "/";

  if (
    pathname.startsWith("/espace-client") ||
    pathname.startsWith("/connexion") ||
    pathname.startsWith("/inscription") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/vendor")
  ) {
    return null;
  }

  const theme = getTheme(pathname);
  const contextualLinks = getRouteLinks(pathname);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={`w-full mt-0 border-t pt-12 pb-4 px-4 md:px-16 ${theme.bg} ${theme.text} ${theme.border}`}>
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row md:justify-between gap-12">
        <div className="flex-1 min-w-[260px]">
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-2xl ${theme.logoBadgeBg} ${theme.logoBadgeText}`}>A</div>
            <span className="text-3xl font-extrabold tracking-wide">Asmyne</span>
          </div>
          <div className={`mb-2 ${theme.muted}`}>Nuestra Direccion:</div>
          <div className="mb-2 font-semibold">Casa 12 Calle primera Urb Mirador Isabela Sector Villa Mella Proximo a la avenida Jacobo Majluta Santo Domingo Norte Rep. Dom.</div>
          <div className={`mb-2 ${theme.muted}`}>
            Soporte 24/7: <span className={theme.text}>1-(809) 308-6370</span>
          </div>
          <div className={`mb-2 ${theme.muted}`}>
            Correo electronico: <span className={theme.text}>contact@asmyne.com</span>
          </div>
        </div>

        <div className="flex-1 min-w-[220px]">
          <div className="font-bold mb-3 text-lg">Suscribete a nuestro boletin</div>
          <div className={`mb-3 ${theme.muted}`}>Registrate para recibir actualizaciones sobre nuestras ultimas noticias.</div>
          <form className="flex items-center mb-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Introduce tu correo electronico"
              className={`rounded-full px-5 py-3 w-full focus:outline-none ${theme.inputBg} ${theme.inputText} ${theme.inputPlaceholder}`}
            />
            <button
              type="submit"
              className={`-ml-10 rounded-full w-10 h-10 flex items-center justify-center shadow transition ${theme.actionBg} ${theme.actionText} ${theme.actionHover}`}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </form>
          <div className={`text-xs ${theme.muted}`}>
            Al suscribirte, aceptas los <Link href="#" className="underline">Terminos de Servicio</Link> y la <Link href="#" className="underline">Politica de Privacidad</Link>.
          </div>
        </div>

        <div className="flex-1 min-w-[180px]">
          <div className="font-bold mb-3 text-lg">Nuestros Servicios</div>
          <ul className={theme.muted}>
            {contextualLinks.services.map((item) => (
              <li className="mb-2" key={`service-${item.href}-${item.label}`}>
                <Link href={item.href} className={theme.linkHover}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 min-w-[180px]">
          <div className="font-bold mb-3 text-lg">Enlaces Rapidos</div>
          <ul className={theme.muted}>
            {contextualLinks.quickLinks.map((item) => (
              <li className="mb-2" key={`quick-${item.href}-${item.label}`}>
                <Link href={item.href} className={theme.linkHover}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <hr className={`my-8 ${theme.border}`} />

      <div className={`max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between items-center gap-4 text-sm ${theme.muted}`}>
        <div>©2026 Asmyne. Todos los derechos reservados.</div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="https://www.facebook.com/share/1KGpFstMcy/" className={theme.socialHover} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <FaFacebookF size={22} />
          </a>
          <a href="https://www.instagram.com/asmynegroup?igsh=M3FpNzA2dTZzdXl4" className={theme.socialHover} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={22} />
          </a>
          <a href="https://www.tiktok.com/@asmynegroup?_r=1&_t=ZS-98GMg7lSOjB" className={theme.socialHover} aria-label="TikTok" target="_blank" rel="noopener noreferrer">
            <FaTiktok size={22} />
          </a>
          <a href="https://www.youtube.com/@asmynegroup" className={theme.socialHover} aria-label="YouTube" target="_blank" rel="noopener noreferrer">
            <FaYoutube size={22} />
          </a>
          <a href="https://whatsapp.com/channel/0029Vb77mjJLtOjIa8b3Bn3x" className={theme.socialHover} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp size={22} />
          </a>
          <a href="https://www.asmynegroup.com" className={theme.socialHover} aria-label="Website" target="_blank" rel="noopener noreferrer">
            <FaGlobe size={22} />
          </a>
        </div>
        <button
          type="button"
          onClick={scrollToTop}
          className={`ml-4 rounded-full w-10 h-10 flex items-center justify-center shadow transition ${theme.topBtnBg} ${theme.topBtnText} ${theme.topBtnHover}`}
          aria-label="Volver arriba"
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
        </button>
      </div>
    </footer>
  );
}
