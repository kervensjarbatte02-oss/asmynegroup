"use client";

import Image from "next/image";
import Link from "next/link";
import { MouseEvent } from "react";

const services = [
  { icon: "/service-migratoire.png", title: "Asesoría migratoria", desc: "Conseil juridique et accompagnement pour vos démarches migratoires.", slug: "conseil-migratoire" },
  { icon: "/service-entrepreneurial.png", title: "Asesoría empresarial", desc: "Accompagnement pour la création et la gestion d'entreprise.", slug: "conseil-entrepreneurial" },
  { icon: "/service-hair.png", title: "Soluciones capilares", desc: "Vente de produits capillaires et dropshipping.", slug: "hair-solutions" },
  { icon: "/service-blog.png", title: "Yontikonsey Blog", desc: "Blog, conseils, communauté active et SEO optimisé.", slug: "yontikonsey-blog" },
  { icon: "/service-voyage.png", title: "Agencia de viajes", desc: "Réservation de vols, hôtels, excursions, location de voitures, Airbnb.", slug: "agence-voyage" },
  { icon: "/service-reseau.png", title: "Red social", desc: "Profils, publications, likes, commentaires, messagerie privée.", slug: "reseau-social" },
  { icon: "/service-dating.png", title: "Encuentros", desc: "Matching, chat privé, sécurité et modération.", slug: "dating" },
  { icon: "/service-chatbot.png", title: "Chatbot inteligente", desc: "Support client 24/7, aide à la navigation, assistance IA.", slug: "chatbot-intelligent" },
  { icon: "/service-marketplace.png", title: "Mercado global", desc: "Achetez, vendez et gérez vos produits et services dans le monde entier.", slug: "marketplace-global" },
  { icon: "/service-monetisation.png", title: "Plataforma de monetización", desc: "Abonnements, coms, revenus automatiques.", slug: "systeme-monetisation" },
];

export default function ServicesSection() {
  const handleRedSocialClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.open("/services/dating", "_blank", "noopener,noreferrer");
    window.location.href = "/services/reseau-social";
  };

  return (
    <section className="w-full flex flex-col items-center px-2 pb-12">
      <div className="grid grid-cols-5 gap-8 w-full max-w-6xl mb-10 justify-center place-items-center">
        {services.map((s, i) => {
          const isRedSocial = s.slug === "reseau-social";
          return (
            <Link
              key={i}
              href={`/services/${s.slug}`}
              className="flex flex-col items-center w-full min-h-[48px] group focus:outline-none"
              onClick={isRedSocial ? handleRedSocialClick : undefined}
            >
              <div className="flex items-center justify-center rounded-full border-4 border-[#e6b85c] bg-[#14213d] w-20 h-20 md:w-24 md:h-24 mb-3 shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Image src={s.icon} alt={s.title} width={128} height={128} className="object-contain" />
              </div>
              <div className="font-bold text-base md:text-lg mb-1 text-center text-[#ffe082] drop-shadow group-hover:text-accent transition-colors duration-200" style={{ color: '#ffe082', textShadow: '0 1px 4px #0008' }}>
                {s.title}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
