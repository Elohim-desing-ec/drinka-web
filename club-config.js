/* =========================================================
   Club DRINKA · configuración
   ========================================================= */

// ✏️ 1) Pega aquí los datos de tu proyecto de Supabase
//    (Supabase → Project Settings → API → Project URL y anon public key)
window.CLUB = {
  supabaseUrl: "https://quchxfoksntnoprgupbv.supabase.co",
  supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1Y2h4Zm9rc250bm9wcmd1cGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU1NzMyNTAsImV4cCI6MjExMTE0OTI1MH0.0xidhBSmAzIcIhOltrbQZDCFF13jzJ48W7PPqnMh64I",

  // WhatsApp de DRINKA (para "Olvidé mi PIN")
  whatsapp: "593961087609",

  // ✏️ 2) Premios: número de sello → premio (10 sellos por tarjeta)
  total: 10,
  premios: {
    3:  { corto: "10%", texto: "10% de descuento" },
    5:  { icono: "gift", texto: "Regalo sorpresa" },
    7:  { corto: "20%", texto: "20% de descuento" },
    10: { icono: "cup", texto: "Bebida gratis" },
  },
};

window.CLUB.listo = !/PEGA_AQUI/.test(window.CLUB.supabaseUrl + window.CLUB.supabaseKey);
