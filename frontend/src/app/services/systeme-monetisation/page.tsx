export default function SystemeMonetisation() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white font-sans flex flex-col items-center py-0">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-r from-[#0f3460] to-[#16213e] shadow-lg">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-[#ffd700] drop-shadow-lg text-center">Plataforma de monetización Premium</h1>
        <p className="mb-8 text-xl md:text-2xl text-white/80 max-w-2xl text-center">Maximice sus ingresos con herramientas potentes: suscripciones, pagos recurrentes, comisiones, gestión automatizada e informes detallados.</p>
        <button className="bg-[#ffd700] text-[#0f3460] font-bold px-8 py-4 rounded-full shadow-lg hover:bg-yellow-400 transition text-lg">Comenzar ahora</button>
      </section>

      {/* Features Cards */}
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 px-4">
        <div className="bg-[#23234b] rounded-2xl p-8 flex flex-col items-center shadow-xl border border-[#ffd700]/20">
          <div className="text-5xl mb-4">💳</div>
          <div className="font-bold text-2xl mb-2 text-[#ffd700]">Suscripciones y pagos</div>
          <div className="text-white/80 text-center">Gestione fácilmente las suscripciones, los pagos recurrentes y las ofertas premium para sus clientes.</div>
        </div>
        <div className="bg-[#23234b] rounded-2xl p-8 flex flex-col items-center shadow-xl border border-[#ffd700]/20">
          <div className="text-5xl mb-4">📈</div>
          <div className="font-bold text-2xl mb-2 text-[#ffd700]">Informes y estadísticas</div>
          <div className="text-white/80 text-center">Siga sus ingresos, analice tendencias y exporte informes detallados con un clic.</div>
        </div>
        <div className="bg-[#23234b] rounded-2xl p-8 flex flex-col items-center shadow-xl border border-[#ffd700]/20">
          <div className="text-5xl mb-4">🤖</div>
          <div className="font-bold text-2xl mb-2 text-[#ffd700]">Automatización</div>
          <div className="text-white/80 text-center">Automatice la gestión de pagos, recordatorios, facturas y notificaciones para ahorrar tiempo.</div>
        </div>
      </section>

      {/* Tabla de ingresos */}
      <section className="w-full max-w-5xl mx-auto mt-20 px-4">
        <h3 className="text-2xl font-bold mb-6 text-[#ffd700]">Resumen de ingresos</h3>
        <div className="overflow-x-auto rounded-2xl shadow-lg border border-[#ffd700]/10 bg-[#23234b]">
          <table className="min-w-full text-left text-white/90">
            <thead>
              <tr className="bg-[#ffd700]/10">
                <th className="py-4 px-6">Mes</th>
                <th className="py-4 px-6">Suscripciones</th>
                <th className="py-4 px-6">Comisiones</th>
                <th className="py-4 px-6">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#ffd700]/10">
                <td className="py-3 px-6">Enero</td>
                <td className="py-3 px-6">2.500 €</td>
                <td className="py-3 px-6">1.200 €</td>
                <td className="py-3 px-6 font-bold text-[#ffd700]">3.700 €</td>
              </tr>
              <tr className="border-t border-[#ffd700]/10">
                <td className="py-3 px-6">Febrero</td>
                <td className="py-3 px-6">2.800 €</td>
                <td className="py-3 px-6">1.100 €</td>
                <td className="py-3 px-6 font-bold text-[#ffd700]">3.900 €</td>
              </tr>
              <tr className="border-t border-[#ffd700]/10">
                <td className="py-3 px-6">Marzo</td>
                <td className="py-3 px-6">3.000 €</td>
                <td className="py-3 px-6">1.350 €</td>
                <td className="py-3 px-6 font-bold text-[#ffd700]">4.350 €</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Gráfico ficticio */}
      <section className="w-full max-w-5xl mx-auto mt-16 px-4">
        <h3 className="text-2xl font-bold mb-6 text-[#ffd700]">Evolución de ingresos</h3>
        <div className="bg-[#23234b] rounded-2xl p-8 flex flex-col items-center shadow-xl border border-[#ffd700]/10">
          <div className="w-full h-48 flex items-end gap-4">
            <div className="flex-1 flex flex-col justify-end"><div className="bg-[#ffd700] w-10 h-24 rounded-t-xl" style={{height:'6rem'}}></div></div>
            <div className="flex-1 flex flex-col justify-end"><div className="bg-[#ffd700] w-10 h-32 rounded-t-xl" style={{height:'8rem'}}></div></div>
            <div className="flex-1 flex flex-col justify-end"><div className="bg-[#ffd700] w-10 h-40 rounded-t-xl" style={{height:'10rem'}}></div></div>
            <div className="flex-1 flex flex-col justify-end"><div className="bg-[#ffd700] w-10 h-28 rounded-t-xl" style={{height:'7rem'}}></div></div>
            <div className="flex-1 flex flex-col justify-end"><div className="bg-[#ffd700] w-10 h-36 rounded-t-xl" style={{height:'9rem'}}></div></div>
          </div>
          <div className="flex justify-between w-full mt-4 text-[#ffd700] font-semibold">
            <span>Nov</span><span>Dic</span><span>Ene</span><span>Feb</span><span>Mar</span>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="w-full max-w-5xl mx-auto mt-20 px-4">
        <h3 className="text-2xl font-bold mb-6 text-[#ffd700]">Testimonios de clientes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#23234b] rounded-2xl p-6 shadow-lg border border-[#ffd700]/10">
            <div className="text-white mb-2">“Gracias a este sistema, duplicé mis ingresos en 3 meses.”</div>
            <div className="font-bold text-[#ffd700]">Sarah B.</div>
            <div className="text-white/60 text-sm">Emprendedora</div>
          </div>
          <div className="bg-[#23234b] rounded-2xl p-6 shadow-lg border border-[#ffd700]/10">
            <div className="text-white mb-2">“La gestión automatizada me ahorra muchísimo tiempo; lo recomiendo.”</div>
            <div className="font-bold text-[#ffd700]">Yann D.</div>
            <div className="text-white/60 text-sm">Consultor</div>
          </div>
          <div className="bg-[#23234b] rounded-2xl p-6 shadow-lg border border-[#ffd700]/10">
            <div className="text-white mb-2">“Los informes son claros y completos, perfectos para gestionar mi actividad.”</div>
            <div className="font-bold text-[#ffd700]">Amina K.</div>
            <div className="text-white/60 text-sm">Coach</div>
          </div>
        </div>
      </section>

      {/* Integración Stripe/PayPal */}
      <section className="w-full max-w-5xl mx-auto mt-20 px-4">
        <h3 className="text-2xl font-bold mb-6 text-[#ffd700]">Integraciones de pago Premium</h3>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="flex-1 flex flex-col items-center bg-[#23234b] rounded-2xl p-8 shadow-lg border border-[#ffd700]/10">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Stripe_Logo%2C_revised_2016.png" alt="Stripe" className="h-10 mb-4" />
            <div className="text-white/80 text-center">Conecte su cuenta de Stripe para aceptar pagos con tarjeta, Apple Pay, Google Pay y mucho más.</div>
          </div>
          <div className="flex-1 flex flex-col items-center bg-[#23234b] rounded-2xl p-8 shadow-lg border border-[#ffd700]/10">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-10 mb-4" />
            <div className="text-white/80 text-center">Active PayPal para ofrecer a sus clientes una solución de pago segura e internacional.</div>
          </div>
        </div>
      </section>

      {/* Ventajas */}
      <section className="w-full max-w-5xl mx-auto mt-20 px-4">
        <h3 className="text-2xl font-bold mb-6 text-[#ffd700]">¿Por qué elegir nuestro sistema?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#23234b] rounded-2xl p-8 flex flex-col items-center shadow-lg border border-[#ffd700]/10">
            <div className="text-4xl mb-3">🔒</div>
            <div className="font-bold text-lg mb-1 text-[#ffd700]">Seguridad bancaria</div>
            <div className="text-white/80 text-center">Todas las transacciones están cifradas y protegidas con los mejores estándares del mercado.</div>
          </div>
          <div className="bg-[#23234b] rounded-2xl p-8 flex flex-col items-center shadow-lg border border-[#ffd700]/10">
            <div className="text-4xl mb-3">⚡</div>
            <div className="font-bold text-lg mb-1 text-[#ffd700]">Pagos instantáneos</div>
            <div className="text-white/80 text-center">Reciba sus fondos en tiempo real, sin esperas ni retrasos innecesarios.</div>
          </div>
          <div className="bg-[#23234b] rounded-2xl p-8 flex flex-col items-center shadow-lg border border-[#ffd700]/10">
            <div className="text-4xl mb-3">🌍</div>
            <div className="font-bold text-lg mb-1 text-[#ffd700]">Internacional</div>
            <div className="text-white/80 text-center">Acepte pagos de todo el mundo en las principales divisas.</div>
          </div>
        </div>
      </section>

      {/* Soporte al cliente */}
      <section className="w-full max-w-5xl mx-auto mt-20 px-4">
        <h3 className="text-2xl font-bold mb-6 text-[#ffd700]">Soporte al cliente premium</h3>
        <div className="bg-[#23234b] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-lg border border-[#ffd700]/10 gap-8">
          <div className="flex-1">
            <div className="font-bold text-lg text-[#ffd700] mb-2">Asistencia 24/7</div>
            <div className="text-white/80 mb-2">Nuestro equipo le acompaña en cada etapa, por chat, correo o teléfono.</div>
            <div className="text-white/60 text-sm">Tiempo de respuesta medio: &lt; 5 minutos</div>
          </div>
          <div className="flex-1 flex justify-center">
            <img src="https://cdn-icons-png.flaticon.com/512/1256/1256650.png" alt="Support" className="h-24 w-24 rounded-full bg-white/10 p-2" />
          </div>
        </div>
      </section>

      {/* Aliados */}
      <section className="w-full max-w-5xl mx-auto mt-20 px-4">
        <h3 className="text-2xl font-bold mb-6 text-[#ffd700]">Confían en nosotros</h3>
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
        <h3 className="text-2xl font-bold mb-6 text-[#ffd700]">Preguntas frecuentes</h3>
        <div className="space-y-4">
          <div className="bg-[#23234b] rounded-xl p-5 shadow border border-[#ffd700]/10">
            <div className="font-semibold text-[#ffd700] mb-2">¿Cómo activar el sistema de monetización?</div>
            <div className="text-white/80">Solo tiene que hacer clic en “Comenzar ahora” y seguir las instrucciones para conectar sus medios de pago.</div>
          </div>
          <div className="bg-[#23234b] rounded-xl p-5 shadow border border-[#ffd700]/10">
            <div className="font-semibold text-[#ffd700] mb-2">¿Qué métodos de pago se aceptan?</div>
            <div className="text-white/80">Tarjetas bancarias, transferencias, PayPal, Stripe y muchos más: todo es compatible.</div>
          </div>
          <div className="bg-[#23234b] rounded-xl p-5 shadow border border-[#ffd700]/10">
            <div className="font-semibold text-[#ffd700] mb-2">¿Puedo exportar mis informes?</div>
            <div className="text-white/80">Sí, todos los informes se pueden exportar en PDF o Excel con un clic.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
