export default function SystemeMonetisation() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white font-sans flex flex-col items-center py-0">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-r from-[#0f3460] to-[#16213e] shadow-lg">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-[#ffd700] drop-shadow-lg text-center">Plataforma de monetización Premium</h1>
        <p className="mb-8 text-xl md:text-2xl text-white/80 max-w-2xl text-center">Maximisez vos revenus avec des outils puissants : abonnements, paiements récurrents, coms, gestion automatisée et rapports détaillés.</p>
        <button className="bg-[#ffd700] text-[#0f3460] font-bold px-8 py-4 rounded-full shadow-lg hover:bg-yellow-400 transition text-lg">Démarrer maintenant</button>
      </section>

      {/* Features Cards */}
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 px-4">
        <div className="bg-[#23234b] rounded-2xl p-8 flex flex-col items-center shadow-xl border border-[#ffd700]/20">
          <div className="text-5xl mb-4">💳</div>
          <div className="font-bold text-2xl mb-2 text-[#ffd700]">Abonnements & Paiements</div>
          <div className="text-white/80 text-center">Gérez facilement les abonnements, paiements récurrents et offres premium pour vos clients.</div>
        </div>
        <div className="bg-[#23234b] rounded-2xl p-8 flex flex-col items-center shadow-xl border border-[#ffd700]/20">
          <div className="text-5xl mb-4">📈</div>
          <div className="font-bold text-2xl mb-2 text-[#ffd700]">Rapports & Statistiques</div>
          <div className="text-white/80 text-center">Suivez vos revenus, analysez les tendances et exportez des rapports détaillés en un clic.</div>
        </div>
        <div className="bg-[#23234b] rounded-2xl p-8 flex flex-col items-center shadow-xl border border-[#ffd700]/20">
          <div className="text-5xl mb-4">🤖</div>
          <div className="font-bold text-2xl mb-2 text-[#ffd700]">Automatisation</div>
          <div className="text-white/80 text-center">Automatisez la gestion des paiements, relances, factures et notifications pour gagner du temps.</div>
        </div>
      </section>

      {/* Tableau de revenus */}
      <section className="w-full max-w-5xl mx-auto mt-20 px-4">
        <h3 className="text-2xl font-bold mb-6 text-[#ffd700]">Aperçu des revenus</h3>
        <div className="overflow-x-auto rounded-2xl shadow-lg border border-[#ffd700]/10 bg-[#23234b]">
          <table className="min-w-full text-left text-white/90">
            <thead>
              <tr className="bg-[#ffd700]/10">
                <th className="py-4 px-6">Mois</th>
                <th className="py-4 px-6">Abonnements</th>
                <th className="py-4 px-6">Coms</th>
                <th className="py-4 px-6">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#ffd700]/10">
                <td className="py-3 px-6">Janvier</td>
                <td className="py-3 px-6">2 500 €</td>
                <td className="py-3 px-6">1 200 €</td>
                <td className="py-3 px-6 font-bold text-[#ffd700]">3 700 €</td>
              </tr>
              <tr className="border-t border-[#ffd700]/10">
                <td className="py-3 px-6">Février</td>
                <td className="py-3 px-6">2 800 €</td>
                <td className="py-3 px-6">1 100 €</td>
                <td className="py-3 px-6 font-bold text-[#ffd700]">3 900 €</td>
              </tr>
              <tr className="border-t border-[#ffd700]/10">
                <td className="py-3 px-6">Mars</td>
                <td className="py-3 px-6">3 000 €</td>
                <td className="py-3 px-6">1 350 €</td>
                <td className="py-3 px-6 font-bold text-[#ffd700]">4 350 €</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Graphique fictif */}
      <section className="w-full max-w-5xl mx-auto mt-16 px-4">
        <h3 className="text-2xl font-bold mb-6 text-[#ffd700]">Évolution des revenus</h3>
        <div className="bg-[#23234b] rounded-2xl p-8 flex flex-col items-center shadow-xl border border-[#ffd700]/10">
          <div className="w-full h-48 flex items-end gap-4">
            <div className="flex-1 flex flex-col justify-end"><div className="bg-[#ffd700] w-10 h-24 rounded-t-xl" style={{height:'6rem'}}></div></div>
            <div className="flex-1 flex flex-col justify-end"><div className="bg-[#ffd700] w-10 h-32 rounded-t-xl" style={{height:'8rem'}}></div></div>
            <div className="flex-1 flex flex-col justify-end"><div className="bg-[#ffd700] w-10 h-40 rounded-t-xl" style={{height:'10rem'}}></div></div>
            <div className="flex-1 flex flex-col justify-end"><div className="bg-[#ffd700] w-10 h-28 rounded-t-xl" style={{height:'7rem'}}></div></div>
            <div className="flex-1 flex flex-col justify-end"><div className="bg-[#ffd700] w-10 h-36 rounded-t-xl" style={{height:'9rem'}}></div></div>
          </div>
          <div className="flex justify-between w-full mt-4 text-[#ffd700] font-semibold">
            <span>Nov</span><span>Déc</span><span>Jan</span><span>Fév</span><span>Mars</span>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="w-full max-w-5xl mx-auto mt-20 px-4">
        <h3 className="text-2xl font-bold mb-6 text-[#ffd700]">Témoignages clients</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#23234b] rounded-2xl p-6 shadow-lg border border-[#ffd700]/10">
            <div className="text-white mb-2">“Grâce à ce système, j’ai doublé mes revenus en 3 mois !”</div>
            <div className="font-bold text-[#ffd700]">Sarah B.</div>
            <div className="text-white/60 text-sm">Entrepreneure</div>
          </div>
          <div className="bg-[#23234b] rounded-2xl p-6 shadow-lg border border-[#ffd700]/10">
            <div className="text-white mb-2">“La gestion automatisée me fait gagner un temps fou, je recommande.”</div>
            <div className="font-bold text-[#ffd700]">Yann D.</div>
            <div className="text-white/60 text-sm">Consultant</div>
          </div>
          <div className="bg-[#23234b] rounded-2xl p-6 shadow-lg border border-[#ffd700]/10">
            <div className="text-white mb-2">“Les rapports sont clairs et complets, parfait pour piloter mon activité.”</div>
            <div className="font-bold text-[#ffd700]">Amina K.</div>
            <div className="text-white/60 text-sm">Coach</div>
          </div>
        </div>
      </section>

      {/* Intégration Stripe/PayPal */}
      <section className="w-full max-w-5xl mx-auto mt-20 px-4">
        <h3 className="text-2xl font-bold mb-6 text-[#ffd700]">Intégrations Paiement Premium</h3>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="flex-1 flex flex-col items-center bg-[#23234b] rounded-2xl p-8 shadow-lg border border-[#ffd700]/10">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Stripe_Logo%2C_revised_2016.png" alt="Stripe" className="h-10 mb-4" />
            <div className="text-white/80 text-center">Connectez votre compte Stripe pour accepter les paiements par carte, Apple Pay, Google Pay et plus encore.</div>
          </div>
          <div className="flex-1 flex flex-col items-center bg-[#23234b] rounded-2xl p-8 shadow-lg border border-[#ffd700]/10">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-10 mb-4" />
            <div className="text-white/80 text-center">Activez PayPal pour offrir à vos clients une solution de paiement sécurisée et internationale.</div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="w-full max-w-5xl mx-auto mt-20 px-4">
        <h3 className="text-2xl font-bold mb-6 text-[#ffd700]">Pourquoi choisir notre système ?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#23234b] rounded-2xl p-8 flex flex-col items-center shadow-lg border border-[#ffd700]/10">
            <div className="text-4xl mb-3">🔒</div>
            <div className="font-bold text-lg mb-1 text-[#ffd700]">Sécurité bancaire</div>
            <div className="text-white/80 text-center">Toutes les transactions sont chiffrées et protégées par les meilleurs standards du marché.</div>
          </div>
          <div className="bg-[#23234b] rounded-2xl p-8 flex flex-col items-center shadow-lg border border-[#ffd700]/10">
            <div className="text-4xl mb-3">⚡</div>
            <div className="font-bold text-lg mb-1 text-[#ffd700]">Paiements instantanés</div>
            <div className="text-white/80 text-center">Recevez vos fonds en temps réel, sans attente ni délai de traitement inutile.</div>
          </div>
          <div className="bg-[#23234b] rounded-2xl p-8 flex flex-col items-center shadow-lg border border-[#ffd700]/10">
            <div className="text-4xl mb-3">🌍</div>
            <div className="font-bold text-lg mb-1 text-[#ffd700]">International</div>
            <div className="text-white/80 text-center">Acceptez des paiements du monde entier, dans toutes les devises principales.</div>
          </div>
        </div>
      </section>

      {/* Support client */}
      <section className="w-full max-w-5xl mx-auto mt-20 px-4">
        <h3 className="text-2xl font-bold mb-6 text-[#ffd700]">Support client premium</h3>
        <div className="bg-[#23234b] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-lg border border-[#ffd700]/10 gap-8">
          <div className="flex-1">
            <div className="font-bold text-lg text-[#ffd700] mb-2">Assistance 24/7</div>
            <div className="text-white/80 mb-2">Notre équipe vous accompagne à chaque étape, par chat, mail ou téléphone.</div>
            <div className="text-white/60 text-sm">Temps de réponse moyen : &lt; 5 minutes</div>
          </div>
          <div className="flex-1 flex justify-center">
            <img src="https://cdn-icons-png.flaticon.com/512/1256/1256650.png" alt="Support" className="h-24 w-24 rounded-full bg-white/10 p-2" />
          </div>
        </div>
      </section>

      {/* Partenaires */}
      <section className="w-full max-w-5xl mx-auto mt-20 px-4">
        <h3 className="text-2xl font-bold mb-6 text-[#ffd700]">Ils nous font confiance</h3>
        <div className="flex flex-wrap gap-8 items-center justify-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="h-8" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_Google_2013_Official.svg" alt="Google" className="h-8" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" alt="IBM" className="h-8" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2e/Accenture.svg" alt="Accenture" className="h-8" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Capgemini_Logo.svg" alt="Capgemini" className="h-8" />
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full max-w-5xl mx-auto mt-20 mb-24 px-4">
        <h3 className="text-2xl font-bold mb-6 text-[#ffd700]">s fréquentes</h3>
        <div className="space-y-4">
          <div className="bg-[#23234b] rounded-xl p-5 shadow border border-[#ffd700]/10">
            <div className="font-semibold text-[#ffd700] mb-2">Comment activer le système de monétisation ?</div>
            <div className="text-white/80">Il suffit de cliquer sur “Démarrer maintenant” et de suivre les instructions pour connecter vos moyens de paiement.</div>
          </div>
          <div className="bg-[#23234b] rounded-xl p-5 shadow border border-[#ffd700]/10">
            <div className="font-semibold text-[#ffd700] mb-2">Quels moyens de paiement sont acceptés ?</div>
            <div className="text-white/80">Cartes bancaires, virements, PayPal, Stripe, et bien d’autres : tout est compatible.</div>
          </div>
          <div className="bg-[#23234b] rounded-xl p-5 shadow border border-[#ffd700]/10">
            <div className="font-semibold text-[#ffd700] mb-2">Puis-je exporter mes rapports ?</div>
            <div className="text-white/80">Oui, tous les rapports sont exportables en PDF ou Excel en un clic.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
