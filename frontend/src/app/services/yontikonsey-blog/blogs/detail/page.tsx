        <div 
          className="mb-8 p-4 bg-pink-50 border-l-4 border-pink-400 italic text-gray-800 text-center rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fadeIn"
          style={{boxShadow: '0 4px 24px 0 rgba(255, 0, 128, 0.10)'}}
        >
          <b className="text-pink-700 text-lg">Mensaje personal de la consultora:</b><br/>
          <span className="block mt-2 mb-4 text-base">“Querido/a inmigrante, cada historia es única y valiosa. No dudes en compartir tus dudas, tus sueños y tus logros. Estoy aquí para acompañarte en tu camino y ayudarte a encontrar soluciones adaptadas a tu situación. ¡Juntos/as podemos avanzar más lejos!”</span>
          <span className="font-bold text-pink-800 text-lg tracking-wide">— Asmyne, Consultora Migratoria</span>
        </div>
import React from "react";

export default function BlogDetail() {
  return (
    <main className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-8" style={{color: 'black'}}>
      <h1 className="text-4xl font-serif font-bold mb-6 text-center" style={{color: 'black'}}>
        Algunos buenos consejos para un inmigrante que vive en Santo Domingo 🇩🇴
      </h1>
      <div className="max-w-2xl w-full">
        <img src="/images/blog.png" alt="Blog" className="w-full h-80 object-cover rounded mb-6" />
        <ol className="list-decimal list-inside text-lg mb-6 space-y-2 text-black">
          <li><b>Aprende el idioma español poco a poco</b><br/>Aunque no lo hables bien de inmediato, intenta aprender algunas palabras cada día. Esto te ayudará a conseguir trabajo, hacer amigos y comprender mejor el sistema.</li>
          <li><b>Ten siempre tus documentos en regla</b><br/>Guarda copias de tu pasaporte, identificación, documentos migratorios y todos los papeles importantes en un lugar seguro. Esto puede ahorrarte muchos problemas.</li>
          <li><b>Evita malas compañías</b><br/>No te metas en problemas, discusiones o actividades que puedan ponerte en peligro. Elige personas que quieran avanzar en la vida.</li>
          <li><b>Aprende a gestionar tu dinero</b><br/>No gastes todo lo que ganas. Aunque sea poco, intenta ahorrar un poco para emergencias.</li>
          <li><b>Respeta las leyes y la cultura del país</b><br/>Cuando respetas a las personas y la forma en que funciona el país, puedes vivir en paz y encontrar más oportunidades.</li>
          <li><b>Cuida tu salud</b><br/>Come bien, duerme lo suficiente y no ignores cuando tu cuerpo no se siente bien. La salud es la mayor riqueza.</li>
          <li><b>Trabaja en tus objetivos</b><br/>No te limites solo a sobrevivir. Busca aprender un oficio, abrir un pequeño negocio o desarrollarte cada día.</li>
          <li><b>Mantén la fe y la paciencia</b><br/>La vida del inmigrante no siempre es fácil. Hay días difíciles, pero con determinación, disciplina y fe, las cosas pueden cambiar.</li>
        </ol>
        <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 italic text-gray-800 text-center rounded">
          ✨ Palabras de ánimo:<br/>
          “Nunca te avergüences de tus comienzos. Cada pequeño paso que das hoy puede abrir grandes puertas para el mañana. Sigue luchando con dignidad, porque tu futuro se construye cada día.”
        </div>
        <h2 className="text-2xl font-bold mt-10 mb-4">¿Qué más necesitas?</h2>
        <h3 className="text-xl font-semibold mb-2">Algunas buenas actividades que un joven inmigrante puede hacer en Santo Domingo para vivir, desarrollarse y ganar dinero con dignidad:</h3>
        <ul className="list-disc list-inside mb-6 space-y-1 text-black">
          <li><b>Trabajos y servicios</b></li>
          <ul className="list-disc list-inside ml-6 text-black" style={{color: 'black'}}>
            <li>Atención al cliente en tiendas, restaurantes o call centers</li>
            <li>Traducción criollo – español – francés para ayudar a otros inmigrantes</li>
            <li>Asistencia migratoria para ayudar a las personas a llenar documentos y obtener información</li>
            <li>Reparto en moto o bicicleta</li>
            <li>Limpieza de oficinas/apartamentos</li>
            <li>Seguridad privada si tiene formación</li>
          </ul>
        </ul>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li><b>Actividades en internet</b></li>
          <ul className="list-disc list-inside ml-6">
            <li>Crear una página de Facebook/TikTok para compartir consejos de vida de inmigrantes</li>
            <li>Marketing digital para pequeños negocios</li>
            <li>Vender ropa, productos de belleza o comida por internet</li>
            <li>Aprender diseño gráfico o edición de video</li>
          </ul>
        </ul>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li><b>Pequeños negocios sencillos</b></li>
          <ul className="list-disc list-inside ml-6">
            <li>Vender comida casera, frituras, jugos, pasteles, etc.</li>
            <li>Vender recargas telefónicas o servicios de transferencias</li>
            <li>Abrir un pequeño servicio de impresión, fotocopias o cyber</li>
            <li>Hacer peinados, uñas o barbería si conoce el oficio</li>
          </ul>
        </ul>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li><b>Aprender un oficio</b></li>
          <ul className="list-disc list-inside ml-6">
            <li>Electricidad</li>
            <li>Plomería</li>
            <li>Reparación de teléfonos</li>
            <li>Mecánica</li>
            <li>Peluquería/barbería</li>
            <li>Cocina/pastelería</li>
          </ul>
        </ul>
        <h3 className="text-xl font-semibold mb-2 mt-8">En Santo Domingo, muchos inmigrantes haitianos han logrado salir adelante con pequeños negocios sencillos que no requieren mucho capital, solo disciplina y buen servicio. Aquí tienes algunas ideas de negocios que funcionan bien:</h3>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li><b>Comida y servicios de comida</b></li>
          <ul className="list-disc list-inside ml-6">
            <li>Vender comida haitiana: arroz con frijoles, legumbres, frituras, pasteles, jugos naturales</li>
            <li>Pequeñas cafeterías o almuerzos para trabajadores</li>
            <li>Hacer pasteles, pan, dulces para vender</li>
          </ul>
        </ul>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li><b>Negocios en internet</b></li>
          <ul className="list-disc list-inside ml-6">
            <li>Vender ropa, zapatos y productos de belleza en Facebook/TikTok</li>
            <li>Servicios de publicidad para pequeños negocios</li>
            <li>Crear páginas de información para la comunidad haitiana</li>
          </ul>
        </ul>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li><b>Servicios para la comunidad inmigrante</b></li>
          <ul className="list-disc list-inside ml-6">
            <li>Asistencia en traducción criollo ↔️ español</li>
            <li>Ayudar con documentos, citas e información</li>
            <li>Servicios de llenado de formularios en línea</li>
            <li>Cyber café / impresión de documentos</li>
          </ul>
        </ul>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li><b>Belleza y estética</b></li>
          <ul className="list-disc list-inside ml-6">
            <li>Barbería</li>
            <li>Peluquería para mujeres</li>
            <li>Uñas, maquillaje, tratamientos capilares</li>
          </ul>
        </ul>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li><b>Comercio y reventa</b></li>
          <ul className="list-disc list-inside ml-6">
            <li>Comprar al por mayor para revender al detalle</li>
            <li>Productos haitianos populares en RD</li>
            <li>Joyería, relojes, accesorios para teléfonos</li>
          </ul>
        </ul>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li><b>Servicios móviles</b></li>
          <ul className="list-disc list-inside ml-6">
            <li>Reparto en moto</li>
            <li>Taxi moto</li>
            <li>Lavado de autos a domicilio</li>
          </ul>
        </ul>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li><b>Oficios con muchas oportunidades</b></li>
          <ul className="list-disc list-inside ml-6">
            <li>Electricidad</li>
            <li>Plomería</li>
            <li>Reparación de teléfonos</li>
            <li>Mecánica</li>
            <li>Construcción</li>
          </ul>
        </ul>
        <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-400 italic text-gray-800 text-center rounded">
          <b>Consejos importantes:</b><br/>
          Elige un negocio que resuelva un problema real<br/>
          Haz que tus clientes se sientan respetados<br/>
          Aprende español cada día<br/>
          No gastes todas las ganancias; ahorra<br/>
          Usa las redes sociales para promoción gratuita<br/>
          Busca siempre mejorar tus habilidades y conocimientos<br/>
          Rodéate de personas positivas y trabajadoras<br/>
          No tengas miedo de pedir ayuda o consejo<br/>
          Participa en actividades comunitarias para ampliar tu red de contactos<br/>
          Mantén una actitud abierta y flexible ante los cambios<br/>
        </div>
        <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-400 italic text-gray-800 text-center rounded">
          “Un inmigrante no tiene que empezar en grande para tener éxito. Lo más importante es la constancia, el buen servicio y el coraje para seguir adelante incluso cuando el comienzo es difícil.”<br/>
          <br/>
          <b>Recuerda:</b> Cada día es una nueva oportunidad para crecer y avanzar. ¡No te rindas!
        </div>
        <div className="mb-8 p-4 bg-purple-50 border-l-4 border-purple-400 italic text-gray-800 text-center rounded">
          <b>Más ideas para progresar:</b><br/>
          - Aprende informática básica para acceder a más empleos.<br/>
          - Participa en cursos gratuitos en línea (YouTube, Coursera, etc.).<br/>
          - Ofrece servicios de reparación (electrodomésticos, bicicletas, etc.).<br/>
          - Organiza pequeños eventos culturales o deportivos en tu comunidad.<br/>
          - Enseña a otros lo que sabes: idiomas, oficios, cocina, etc.<br/>
          - Busca asociaciones de apoyo a inmigrantes en tu ciudad.<br/>
        </div>
      </div>
    </main>
  );
}
