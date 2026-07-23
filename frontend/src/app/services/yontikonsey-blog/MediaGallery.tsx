export default function MediaGallery() {
  return (
    <section className="w-full max-w-5xl mx-auto mt-16 px-4">
      <h2 className="text-3xl font-bold mb-10 text-[#2d72d9] border-l-4 border-[#2d72d9] pl-3">Galerie multimédia</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Vidéo immersive */}
        <div className="relative group overflow-hidden rounded-2xl shadow-lg aspect-video">
          <video controls className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300">
            <source src="/videos/video1.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la vidéo.
          </video>
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3 flex items-end">
            <span className="text-white font-semibold text-lg">Titre de la vidéo</span>
          </div>
        </div>
        {/* Photo immersive */}
        <div className="relative group overflow-hidden rounded-2xl shadow-lg aspect-video">
          <img src="/images/blog.png" alt="Exemple" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3 flex items-end">
            <span className="text-white font-semibold text-lg">Légende de la photo</span>
          </div>
        </div>
        {/* Texte à la une façon carte portfolio */}
        <div className="relative group overflow-hidden rounded-2xl shadow-lg aspect-video bg-gradient-to-br from-[#e0e7ef] to-[#f8fafc] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition duration-300" />
          <div className="relative p-6">
            <h3 className="text-2xl font-bold text-[#2d72d9] mb-2">Texte à la une</h3>
            <p className="text-gray-700 text-lg">Voici un exemple de texte ou d’extrait littéraire à mettre en avant dans la galerie.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
