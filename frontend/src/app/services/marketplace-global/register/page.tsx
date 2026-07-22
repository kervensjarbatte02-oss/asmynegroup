"use client";
import { useState } from "react";
import Link from "next/link";

// Liste complète des pays (ISO 3166)
const countries = [
  "Afghanistan", "Afrique du Sud", "Albanie", "Algérie", "Allemagne", "Andorre", "Angola", "Antigua-et-Barbuda", "Arabie saoudite", "Argentine", "Arménie", "Australie", "Autriche", "Azerbaïdjan", "Bahamas", "Bahreïn", "Bangladesh", "Barbade", "Belgique", "Belize", "Bénin", "Bhoutan", "Biélorussie", "Birmanie", "Bolivie", "Bosnie-Herzégovine", "Botswana", "Brésil", "Brunei", "Bulgarie", "Burkina Faso", "Burundi", "Cambodge", "Cameroun", "Canada", "Cap-Vert", "République centrafricaine", "Chili", "Chine", "Chypre", "Colombie", "Comores", "Congo", "République du Congo", "Corée du Nord", "Corée du Sud", "Costa Rica", "Côte d'Ivoire", "Croatie", "Cuba", "Danemark", "Djibouti", "Dominique", "Égypte", "Émirats arabes unis", "Équateur", "Érythrée", "Espagne", "Estonie", "Eswatini", "États-Unis", "Éthiopie", "Fidji", "Finlande", "France", "Gabon", "Gambie", "Géorgie", "Ghana", "Grèce", "Grenade", "Guatemala", "Guinée", "Guinée-Bissau", "Guinée équatoriale", "Guyana", "Haïti", "Honduras", "Hongrie", "Inde", "Indonésie", "Irak", "Iran", "Irlande", "Islande", "Israël", "Italie", "Jamaïque", "Japon", "Jordanie", "Kazakhstan", "Kenya", "Kirghizistan", "Kiribati", "Koweït", "Laos", "Lesotho", "Lettonie", "Liban", "Liberia", "Libye", "Liechtenstein", "Lituanie", "Luxembourg", "Macédoine du Nord", "Madagascar", "Malaisie", "Malawi", "Maldives", "Mali", "Malte", "Maroc", "Îles Marshall", "Maurice", "Mauritanie", "Mexique", "Micronésie", "Moldavie", "Monaco", "Mongolie", "Monténégro", "Mozambique", "Namibie", "Nauru", "Népal", "Nicaragua", "Niger", "Nigéria", "Norvège", "Nouvelle-Zélande", "Oman", "Ouganda", "Ouzbékistan", "Pakistan", "Palaos", "Palestine", "Panama", "Papouasie-Nouvelle-Guinée", "Paraguay", "Pays-Bas", "Pérou", "Philippines", "Pologne", "Portugal", "Qatar", "Roumanie", "Royaume-Uni", "Russie", "Rwanda", "Saint-Kitts-et-Nevis", "Saint-Marin", "Saint-Vincent-et-les-Grenadines", "Sainte-Lucie", "Salomon", "Salvador", "Samoa", "Sao Tomé-et-Principe", "Sénégal", "Serbie", "Seychelles", "Sierra Leone", "Singapour", "Slovaquie", "Slovénie", "Somalie", "Soudan", "Soudan du Sud", "Sri Lanka", "Suède", "Suisse", "Suriname", "Syrie", "Tadjikistan", "Tanzanie", "Tchad", "République tchèque", "Thaïlande", "Timor oriental", "Togo", "Tonga", "Trinité-et-Tobago", "Tunisie", "Turkménistan", "Turquie", "Tuvalu", "Ukraine", "Uruguay", "Vanuatu", "Vatican", "Venezuela", "Viêt Nam", "Yémen", "Zambie", "Zimbabwe"
];

export default function RegisterPage() {
  // Múltiples pasos: 1 = identidad, 2 = contacto, 3 = contraseña, 4 = OTP
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    pays: "",
    email: "",
    adresse: "",
    numero: "",
    password: "",
    otp: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  // Validation simple par étape
  const validateStep = () => {
    if (step === 1 && (!form.nom || !form.prenom || !form.pays)) return "Por favor completa todos los campos.";
    if (step === 2 && (!form.email || !form.adresse || !form.numero)) return "Por favor completa todos los campos.";
    if (step === 3 && !form.password) return "Por favor ingresa una contraseña.";
    return "";
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep(step + 1);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Simuler l'envoi OTP
    setTimeout(() => {
      setOtpSent(true);
      setStep(4);
      setLoading(false);
    }, 1000);
  };

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Simuler la vérification OTP
    setTimeout(() => {
      if (form.otp === "123456") {
        window.location.href = "/services/marketplace-global/login";
      } else {
        setError("Code OTP incorrect.");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Registro</h1>
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Nom</label>
              <input name="nom" value={form.nom} onChange={handleChange} className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-black dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Prénom</label>
              <input name="prenom" value={form.prenom} onChange={handleChange} className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-black dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Pays</label>
              <select name="pays" value={form.pays} onChange={handleChange} className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-black dark:bg-gray-800 dark:text-white">
                <option value="">Sélectionner un pays</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button type="submit" className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition font-semibold">Suivant</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleNext} className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-black dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Adresse complète</label>
              <input name="adresse" value={form.adresse} onChange={handleChange} className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-black dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Numéro de téléphone</label>
              <input name="numero" value={form.numero} onChange={handleChange} className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-black dark:bg-gray-800 dark:text-white" />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button type="submit" className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition font-semibold">Siguiente</button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Contraseña</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-black dark:bg-gray-800 dark:text-white" />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button type="submit" className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition font-semibold" disabled={loading}>{loading ? "Enviando el código..." : "Registrarme"}</button>
          </form>
        )}
        {step === 4 && (
          <form onSubmit={handleOtp} className="space-y-6">
            <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Código OTP enviado por correo o SMS</label>
              <input name="otp" value={form.otp} onChange={handleChange} className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-black dark:bg-gray-800 dark:text-white tracking-widest text-lg text-center" maxLength={6} />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button type="submit" className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition font-semibold" disabled={loading}>{loading ? "Verificando..." : "Validar código"}</button>
            <div className="text-center text-gray-500 text-sm mt-2">Código de prueba: <span className="font-mono">123456</span></div>
          </form>
        )}
        <div className="mt-4 text-center">
          <span className="text-gray-600 dark:text-gray-300">¿Ya tienes cuenta? </span>
          <Link href="/services/marketplace-global/login" className="text-blue-600 hover:underline">Iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
}
