"use client";

import Image from "next/image";
import Script from "next/script";

export default function VoituresPage() {
  return (
    <>
      {/* Navbar */}
      <nav className="w-full bg-black text-white py-4 px-8 flex items-center justify-between shadow z-30 relative">
        <div className="flex items-center gap-3">
          <img src="/asmyne-group-logo.png" alt="Asmyne Group" width={48} style={{height: 'auto'}} className="object-contain" />
          <span className="text-2xl font-extrabold tracking-tight">Asmyne Voyages</span>
        </div>
        <div className="hidden md:flex gap-8 text-lg font-semibold">
          <a href="/services/agence-voyage" className="hover:underline">Accueil</a>
          <a href="/voitures" className="hover:underline underline">Voitures</a>
        </div>
        <div className="text-sm">Contact :Asmyn-goupe</div>
      </nav>
      <div className="min-h-screen w-full font-sans overflow-x-hidden flex flex-col items-center justify-center p-0 relative">
        {/* Image de fond */}
        <Image
          src="/images/rentcar.png"
          alt="Location de voitures"
          fill
          className="object-cover w-full h-full absolute inset-0 z-0"
          priority
        />
        {/* Contenu */}
        <div className="relative z-20 w-full flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-6 text-blue-900">Location de voitures</h1>
          <div className="w-full max-w-2xl flex flex-col gap-8 items-center">
            {/* Widget 1 */}
            <div className="w-full flex justify-center">
              <Script
                id="kiwi-voiture-widget"
                async
                src="https://tpembd.com/content?currency=USD&trs=530652&shmarker=729955&locale=en&from=&to=&country=&powered_by=true&height=&wtype=true&transfers_limit=10&bg_color=%23f5f5f5&button_color=%23239a54&button_font_color=%23ffffff&button_hover_color=%230274da&border_color=%23f9ac1a&input_font_color=%23c8ced4&input_bg_color=%23ffffff&input_label_color=%23c8ced4&icon_bg_color=%23ffffff&icon_arrow_color=%236c7c8c&icon_bg_color_mobile=%23f9ac1a&icon_arrow_color_mobile=%23ffffff&autocomplete_font_color=%23373f47&autocomplete_bg_color=%23ffffff&autocomplete_font_color_active=%23ffffff&autocomplete_bg_color_active=%23239a54&loader_color=%23f9ac1a&empty_color=%23373f47&info_bg_color=%23fff0cc&info_icon_color=%234a4a4a&info_caption_color=%234a4a4a&class_background=%23ffffff&class_font_color=%23373f47&class_header_color=%236c7c8c&class_button_background=%2326a65b&class_button_font_color=%23ffffff&class_button_background_hover=%230274da&class_comment_background=%23bfc0c4&class_comment_font=%23bfc0c4&more_background=&more_background_hover=&more_font_color=%230267c1&notification_background=%23f6f1ec&notification_border_color=%23e37f17&notification_color=%23373f47&transfer_background=%23f6f7f8&transfer_background_hover=%23f6f7f8&transfer_font_color=%23373f47&campaign_id=1&promo_id=2949"
                charSet="utf-8"
              />
            </div>
            {/* Lien affilié Kiwitaxi */}
            <div className="w-full flex flex-col items-center gap-4">
              <a
                href="https://kiwitaxi.tpx.lv/w76xdKOd"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded shadow-lg text-lg transition"
              >
                Réserver un transfert aéroport (Kiwitaxi)
              </a>
              <a
                href="https://localrent.tpx.lv/4NWJ2syl"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow-lg text-lg transition"
              >
                Louer une voiture (Localrent)
              </a>
            </div>
          </div>
          {/* Second widget Kiwi */}
          <div className="w-full flex justify-center mt-8">
            <Script
              id="kiwi-voiture-widget-2"
              async
              src="//tpembd.com/content?trs=530652&shmarker=729955&locale=en&country=153&city=68511&powered_by=true&campaign_id=87&promo_id=2466"
              charSet="utf-8"
            />
          </div>
        </div>
      </div>
    </>
  );
}
