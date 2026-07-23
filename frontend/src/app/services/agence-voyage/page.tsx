"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AgenceVoyage() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
		const heroScriptId = "kiwi-hero-script";
		const bottomScriptId = "kiwi-bottom-script";

		const cleanup = () => {
			// Remove ALL Kiwi scripts
			document.querySelectorAll(`script[id="${heroScriptId}"], script[id="${bottomScriptId}"]`).forEach(el => el.remove());
			
			// Remove ALL Kiwi widgets and related DOM elements
			document.querySelectorAll(".tp-widget, .tp-widget-content, .tp-provider, [class*='tp-'], [class*='travelpayouts'], iframe[src*='tpembd']").forEach(el => el.remove());
			
			// Clear any inline styles that might hide/show these
			document.body.style.removeProperty('--kiwi-display');
		};

		// Clean up any previous instances
		cleanup();

		// Add hero script
		const heroScript = document.createElement("script");
		heroScript.id = heroScriptId;
		heroScript.src = "https://tpembd.com/content?currency=usd&trs=530652&shmarker=729955&locale=en&powered_by=true&limit=4&primary_color=0029AEff&results_background_color=FFFFFF&form_background_color=FFFFFF&campaign_id=111&promo_id=3411";
		heroScript.async = true;
		heroScript.charset = "utf-8";
		document.body.appendChild(heroScript);

		// Add bottom script
		const bottomScript = document.createElement("script");
		bottomScript.id = bottomScriptId;
		bottomScript.async = true;
		bottomScript.src = "https://tpembd.com/content?currency=USD&trs=530652&shmarker=729955&locale=en&from=&to=&country=&powered_by=true&height=&wtype=true&transfers_limit=10&bg_color=%23f5f5f5&button_color=%23239a54&button_font_color=%23ffffff&button_hover_color=%230274da&border_color=%23f9ac1a&input_font_color=%23c8ced4&input_bg_color=%23ffffff&input_label_color=%23c8ced4&icon_bg_color=%23ffffff&icon_arrow_color=%236c7c8c&icon_bg_color_mobile=%23f9ac1a&icon_arrow_color_mobile=%23ffffff&autocomplete_font_color=%23373f47&autocomplete_bg_color=%23ffffff&autocomplete_font_color_active=%23ffffff&autocomplete_bg_color_active=%23239a54&loader_color=%23f9ac1a&empty_color=%23373f47&info_bg_color=%23fff0cc&info_icon_color=%234a4a4a&info_caption_color=%234a4a4a&class_background=%23ffffff&class_font_color=%23373f47&class_header_color=%236c7c8c&class_button_background=%2326a65b&class_button_font_color=%23ffffff&class_button_background_hover=%230274da&class_comment_background=%23bfc0c4&class_comment_font=%23bfc0c4&more_background=&more_background_hover=&more_font_color=%230267c1&notification_background=%23f6f1ec&notification_border_color=%23e37f17&notification_color=%23373f47&transfer_background=%23f6f7f8&transfer_background_hover=%23f6f7f8&transfer_font_color=%23373f47&campaign_id=1&promo_id=2949";
		document.body.appendChild(bottomScript);

		// Aggressive cleanup on unmount
		return () => {
			cleanup();
			// Double check removal
			setTimeout(() => cleanup(), 100);
		};
	}, [isClient]);

	if (!isClient) return null;

	return (
		<div className="min-h-screen w-full bg-white font-sans overflow-x-hidden" style={{ background: '#fff' }}>
			{/* Navbar */}
			<nav className="w-full bg-blue-900 text-white py-4 px-8 flex items-center justify-between shadow">
				<div className="flex items-center gap-3">
					<Image src="/asmyne-group-logo.png" alt="Asmyne Group" width={48} height={48} className="object-contain" />
					<span className="text-2xl font-extrabold tracking-tight">Asmyne Voyages</span>
				</div>
				<div className="hidden md:flex gap-8 text-lg font-semibold">
					<a href="#vols" className="hover:underline">Vols</a>
					<a href="#hotels" className="hover:underline">Hôtels</a>
					  <a href="/voitures" className="hover:underline">Voitures</a>
					<a href="#activites" className="hover:underline">Activités</a>
				</div>
				<div className="text-sm">Contact :Asmyn-goupe</div>
			</nav>

			{/* Hero avec titre, sous-titre et barre de recherche Kiwi */}
			<section className="w-full min-h-[28rem] flex flex-col items-center justify-center relative m-0 p-0 overflow-hidden">
			  {/* Image de fond */}
			<Image
				src="/images/agence.png"
				alt="Voyage agence"
			    fill
			    className="object-cover w-full h-full absolute inset-0 z-0"
			    priority
			  />
			  {/* Contenu du hero au-dessus de l'image */}
			  <div className="relative z-20 flex flex-col items-center justify-center w-full h-full min-h-[28rem]">
			    {/* Barre de recherche personnalisée Kiwi dans le hero */}
			    <div id="tp-widget-hero" className="w-full flex justify-center m-0 p-0"></div>
			    
			  </div>
			</section>
			{/* Lien affilié Kiwitaxi */}
			<div className="w-full flex justify-center my-8">
				<a
					href="https://kiwitaxi.tpx.lv/w76xdKOd"
					target="_blank"
					rel="noopener noreferrer"
					className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded shadow-lg text-lg transition"
				>
					Réserver un transfert aéroport (Kiwitaxi)
				</a>
			</div>
			{/* Script Kiwi en bas de page */}
			
		</div>
			);
}
