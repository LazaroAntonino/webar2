// Datos base de localidades para landings informativas.
// Los rangos de precios son estimaciones orientativas basadas en información de mercado
// inmobiliario público para 2024-2025. Deben revisarse y actualizarse con datos reales
// de la oficina cuando estén disponibles.

export const localidades = [
  {
    slug: "las-rozas",
    nombre: "Las Rozas",
    provincia: "Madrid",
    zona: "Noroeste de Madrid",
    tipoMercado: "residencial familiar consolidado",
    tipologiaPrincipal: "chalets adosados e independientes, pisos de tamaño medio-alto",
    zonasDemandadas: ["Las Rozas de Madrid centro", "Monteclaro", "El Cantizal", "Parque Empresarial"],
    perfilComprador: "familias que buscan espacio, seguridad y buena conexión con Madrid",
    factoresClave: [
      "Excelente comunicación por A-6 y Cercanías",
      "Colegios públicos y concertados reconocidos",
      "Amplia oferta de zonas verdes y centros comerciales",
      "Alta demanda de vivienda unifamiliar"
    ],
    mercado: {
      precioMedioM2: 3800,
      rangoMinM2: 3200,
      rangoMaxM2: 4800,
      tendencia: "estable con ligero crecimiento",
      tiempoVentaMedio: "3 a 4 meses",
      demanda: "alta",
      observacion: "Los chalets bien ubicados y con parcela se venden más rápido que la media."
    }
  },
  {
    slug: "pozuelo-de-alarcon",
    nombre: "Pozuelo de Alarcón",
    provincia: "Madrid",
    zona: "Noroeste de Madrid",
    tipoMercado: "premium y alto standing",
    tipologiaPrincipal: "pisos grandes, áticos, chalets independientes y pareados de lujo",
    zonasDemandadas: ["Pozuelo centro", "La Finca", "Somosaguas", "Prado del Rey", "Humeros"],
    perfilComprador: "perfiles de alto poder adquisitivo, ejecutivos, familias internacionales",
    factoresClave: [
      "Una de las rentas per cápita más altas de España",
      "Centros educativos de prestigio internacional",
      "Proximidad a Madrid capital y a grandes parques empresariales",
      "Alta escasez de suelo, lo que sostiene los precios"
    ],
    mercado: {
      precioMedioM2: 4500,
      rangoMinM2: 3800,
      rangoMaxM2: 6000,
      tendencia: "crecimiento sostenido",
      tiempoVentaMedio: "2 a 3 meses",
      demanda: "muy alta",
      observacion: "La calidad de acabados, terraza, garaje y trastero son determinantes en el precio."
    }
  },
  {
    slug: "el-escorial",
    nombre: "El Escorial",
    provincia: "Madrid",
    zona: "Sierra de Guadarrama",
    tipoMercado: "residencial tradicional con componente de segunda residencia",
    tipologiaPrincipal: "pisos en el casco urbano, chalets y casas rústicas en entornos naturales",
    zonasDemandadas: ["Casco histórico de El Escorial", "San Lorenzo de El Escorial", "Las Zúas", "Entornos de la Sierra"],
    perfilComprador: "familias que valoran naturaleza, tranquilidad y patrimonio histórico",
    factoresClave: [
      "Patrimonio cultural y turístico de primer orden",
      "Entorno natural de la Sierra de Guadarrama",
      "Menor densidad de población que en el área metropolitana",
      "Conexión por carretera con Madrid en menos de una hora"
    ],
    mercado: {
      precioMedioM2: 2400,
      rangoMinM2: 1900,
      rangoMaxM2: 3200,
      tendencia: "estable",
      tiempoVentaMedio: "4 a 6 meses",
      demanda: "media-alta",
      observacion: "Las propiedades con vistas, jardín o proximidad al casco histórico tienen mejor salida."
    }
  },
  {
    slug: "majadahonda",
    nombre: "Majadahonda",
    provincia: "Madrid",
    zona: "Noroeste de Madrid",
    tipoMercado: "residencial de alto standing con perfil familiar",
    tipologiaPrincipal: "chalets independientes y pareados, pisos de calidad en urbanizaciones",
    zonasDemandadas: ["Majadahonda centro", "El Plantío", "Monte del Pilar", "Urbanizaciones del noroeste"],
    perfilComprador: "familias de alto poder adquisitivo que buscan espacio, colegios y cercanía a Madrid",
    factoresClave: [
      "Excelente comunicación por A-6 y M-50",
      "Colegios nacionales e internacionales de prestigio",
      "Amplias zonas verdes y urbanizaciones consolidadas",
      "Alta demanda de vivienda unifamiliar bien ubicada"
    ],
    mercado: {
      precioMedioM2: 4000,
      rangoMinM2: 3400,
      rangoMaxM2: 5000,
      tendencia: "estable con ligero crecimiento",
      tiempoVentaMedio: "3 a 4 meses",
      demanda: "alta",
      observacion: "Los chalets con parcela y las viviendas reformadas tienen mejor salida."
    }
  },
  {
    slug: "chamberi",
    nombre: "Chamberí",
    provincia: "Madrid",
    zona: "Madrid capital",
    tipoMercado: "distrito céntrico consolidado con alta demanda",
    tipologiaPrincipal: "pisos en edificios históricos, áticos y pequeñas viviendas singulares",
    zonasDemandadas: ["Chamberí", "Trafalgar", "Almagro", "Gaztambide", "Vallehermoso"],
    perfilComprador: "jóvenes profesionales, parejas y familias que buscan vida urbana con encanto",
    factoresClave: [
      "Ubicación céntrica con excelente transporte público",
      "Edificios históricos y arquitectura de principios del siglo XX",
      "Oferta comercial, cultura y gastronomía de primer nivel",
      "Alta demanda de pisos reformados y bien orientados"
    ],
    mercado: {
      precioMedioM2: 5500,
      rangoMinM2: 4500,
      rangoMaxM2: 7000,
      tendencia: "estable",
      tiempoVentaMedio: "2 a 4 meses",
      demanda: "muy alta",
      observacion: "La reforma integral, la orientación y la planta alta son factores clave."
    }
  },
  {
    slug: "salamanca",
    nombre: "Salamanca",
    provincia: "Madrid",
    zona: "Madrid capital",
    tipoMercado: "distrito premium y de máximo nivel adquisitivo",
    tipologiaPrincipal: "pisos de lujo, áticos dúplex y viviendas señoriales",
    zonasDemandadas: ["Castellana", "Serrano", "Velázquez", "Goya", "Lista", "Recoletos"],
    perfilComprador: "perfiles de alto y muy alto poder adquisitivo, inversores y compradores internacionales",
    factoresClave: [
      "Zona más exclusiva de Madrid capital",
      "Proximidad a embajadas, negocios de lujo y zona financiera",
      "Edificios representativos con portería y servicios",
      "Alta demanda de inversores y compradores internacionales"
    ],
    mercado: {
      precioMedioM2: 7000,
      rangoMinM2: 5500,
      rangoMaxM2: 9000,
      tendencia: "crecimiento sostenido",
      tiempoVentaMedio: "2 a 3 meses",
      demanda: "muy alta",
      observacion: "Los acabados de lujo, terraza, garaje doble y vistas son determinantes en el precio."
    }
  }
];
