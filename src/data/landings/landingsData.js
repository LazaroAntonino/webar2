import { localidades } from "./localidades.js";

const BASE_URL = "https://ar2house.com";
const CURRENT_YEAR = new Date().getFullYear();
const FECHA_PUBLICACION = "2025-08-10";
const FECHA_MODIFICACION = "2025-08-10";

function formatCurrency(value) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

const RELACIONADAS_VALOR = {
  "las-rozas": ["vender-casa/las-rozas", "cuanto-vale-una-casa/pozuelo-de-alarcon", "que-es-ar2"],
  "pozuelo-de-alarcon": ["vender-casa/pozuelo-de-alarcon", "cuanto-vale-una-casa/majadahonda", "que-es-ar2"],
  "majadahonda": ["vender-casa/majadahonda", "cuanto-vale-una-casa/las-rozas", "por-que-elegir-agencia-inmobiliaria-premium"],
  "el-escorial": ["vender-casa/el-escorial", "cuanto-vale-una-casa/las-rozas", "que-es-ar2"],
  "chamberi": ["vender-casa/chamberi", "cuanto-vale-una-casa/salamanca", "tasacion-gratuita-vivienda-madrid"],
  "salamanca": ["vender-casa/salamanca", "cuanto-vale-una-casa/chamberi", "opiniones-ar2-consulting"],
};

const RELACIONADAS_VENTA = {
  "las-rozas": ["cuanto-vale-una-casa/las-rozas", "vender-casa/pozuelo-de-alarcon", "que-es-ar2"],
  "pozuelo-de-alarcon": ["cuanto-vale-una-casa/pozuelo-de-alarcon", "vender-casa/majadahonda", "que-es-ar2"],
  "majadahonda": ["cuanto-vale-una-casa/majadahonda", "vender-casa/las-rozas", "por-que-elegir-agencia-inmobiliaria-premium"],
  "el-escorial": ["cuanto-vale-una-casa/el-escorial", "vender-casa/las-rozas", "que-es-ar2"],
  "chamberi": ["cuanto-vale-una-casa/chamberi", "vender-casa/salamanca", "tasacion-gratuita-vivienda-madrid"],
  "salamanca": ["cuanto-vale-una-casa/salamanca", "vender-casa/chamberi", "opiniones-ar2-consulting"],
};

function generarLandingValor(localidad) {
  const slug = `cuanto-vale-una-casa/${localidad.slug}`;
  const url = `${BASE_URL}/${slug}`;
  const titulo = `¿Cuánto vale una casa en ${localidad.nombre} en ${CURRENT_YEAR}? | AR2`;
  const descripcion = `Descubre el precio medio por metro cuadrado en ${localidad.nombre}, los factores que más valoran los compradores y cómo AR2 puede tasar tu vivienda de forma gratuita.`;

  return {
    slug,
    tipo: "valor-mercado",
    ogType: "article",
    localidad: localidad.nombre,
    url,
    titulo,
    metaDescription: descripcion,
    fechaPublicacion: FECHA_PUBLICACION,
    fechaModificacion: FECHA_MODIFICACION,
    h1: `¿Cuánto vale una casa en ${localidad.nombre}?`,
    introduccion: `${localidad.nombre} es uno de los mercados ${localidad.tipoMercado} más relevantes del ${localidad.zona}. Si estás pensando en comprar, vender o simplemente conocer el valor real de una vivienda, es fundamental entender no solo el precio medio, sino también los elementos que hacen que una propiedad se sitúe por encima o por debajo de la media local. En AR2 analizamos cada vivienda de forma individualizada, comparando datos de mercado actualizados con las características específicas del inmueble.`,
    secciones: [
      {
        titulo: `Precio medio de la vivienda en ${localidad.nombre}`,
        contenido: `Según nuestro análisis del mercado inmobiliario en ${localidad.nombre}, el precio medio se sitúa en torno a ${formatCurrency(localidad.mercado.precioMedioM2)} por metro cuadrado. El rango de referencia oscila entre los ${formatCurrency(localidad.mercado.rangoMinM2)} y los ${formatCurrency(localidad.mercado.rangoMaxM2)} por metro cuadrado, dependiendo de la tipología, el estado de conservación, la orientación y la zona exacta dentro del municipio.`,
        items: [
          `Precio medio estimado: ${formatCurrency(localidad.mercado.precioMedioM2)}/m²`,
          `Rango de precios: ${formatCurrency(localidad.mercado.rangoMinM2)} - ${formatCurrency(localidad.mercado.rangoMaxM2)}/m²`,
          `Tendencia del mercado: ${localidad.mercado.tendencia}`,
          `Tiempo medio de venta: ${localidad.mercado.tiempoVentaMedio}`,
          `Nivel de demanda: ${localidad.mercado.demanda}`
        ]
      },
      {
        titulo: "Factores que determinan el valor de una vivienda",
        contenido: `El valor de una casa no depende únicamente de su tamaño. En ${localidad.nombre}, estos son algunos de los factores que más influyen en el precio final:`,
        items: localidad.factoresClave
      },
      {
        titulo: "¿Cómo saber cuánto vale tu casa exactamente?",
        contenido: `Las estadísticas de mercado son una buena referencia, pero cada vivienda es un caso particular. Para conocer el valor real de una casa en ${localidad.nombre} es necesario realizar una valoración profesional que incluya un estudio comparativo con ventas reales recientes, una inspección del estado del inmueble y un análisis de la situación registral y urbanística. En AR2 realizamos valoraciones gratuitas y sin compromiso, con un enfoque realista que evita tanto sobrevalorar como infra valorar la propiedad.`
      },
      {
        titulo: `Zonas más demandadas en ${localidad.nombre}`,
        contenido: `La ubicación dentro del propio municipio marca una diferencia importante. En ${localidad.nombre}, las zonas con mayor demanda suelen ser:`,
        items: localidad.zonasDemandadas
      }
    ],
    faqs: [
      {
        pregunta: `¿Es caro comprar una casa en ${localidad.nombre}?`,
        respuesta: `Comparado con otras zonas de Madrid, ${localidad.nombre} se sitúa en un rango ${localidad.mercado.precioMedioM2 > 5500 ? "premium" : localidad.mercado.precioMedioM2 > 4000 ? "medio-alto" : "medio"}. La relación calidad-precio depende mucho de la tipología y la zona específica.`
      },
      {
        pregunta: "¿El precio por metro cuadrado es lo único que importa?",
        respuesta: "No. El estado de conservación, la calidad de los acabados, la orientación, la existencia de terraza, garaje, trastero o ascensor, y la situación exacta dentro de la localidad pueden modificar sensiblemente el valor."
      },
      {
        pregunta: "¿Con qué frecuencia cambian los precios?",
        respuesta: "El mercado inmobiliario evoluciona trimestralmente. Por eso, una valoración profesional debe basarse en transacciones reales de los últimos 3 a 6 meses."
      }
    ],
    relacionadas: RELACIONADAS_VALOR[localidad.slug] || [`vender-casa/${localidad.slug}`, "que-es-ar2"],
    cta: {
      texto: "Solicitar una valoración gratuita",
      enlace: "/#contacto",
      descripcion: `Conoce el valor real de tu casa en ${localidad.nombre} con un informe personalizado de AR2.`
    }
  };
}

function generarLandingVenta(localidad) {
  const slug = `vender-casa/${localidad.slug}`;
  const url = `${BASE_URL}/${slug}`;
  const titulo = `¿Por cuánto puedo vender mi casa en ${localidad.nombre}? | AR2`;
  const descripcion = `Te explicamos cuánto puedes obtener por tu casa en ${localidad.nombre}, qué errores evitar al fijar el precio y cómo AR2 te ayuda a vender al mejor precio y en el menor tiempo.`;

  return {
    slug,
    tipo: "vender-casa",
    ogType: "article",
    localidad: localidad.nombre,
    url,
    titulo,
    metaDescription: descripcion,
    fechaPublicacion: FECHA_PUBLICACION,
    fechaModificacion: FECHA_MODIFICACION,
    h1: `¿Por cuánto puedo vender mi casa en ${localidad.nombre}?`,
    introduccion: `Vender una casa en ${localidad.nombre} puede ser una excelente operación si se hace con la estrategia correcta. El primer paso es conocer el precio de salida adecuado: ni tan alto que aleje a los compradores, ni tan bajo que deje dinero sobre la mesa. En AR2 ayudamos a los propietarios de ${localidad.nombre} a definir un precio realista, preparar el inmueble para las visitas y gestionar el proceso de venta con total transparencia.`,
    secciones: [
      {
        titulo: `¿Cuánto puedes pedir por tu casa en ${localidad.nombre}?`,
        contenido: `El precio de venta dependerá de la tipología, el estado y la ubicación exacta. Como referencia, en ${localidad.nombre} el precio medio por metro cuadrado se sitúa en ${formatCurrency(localidad.mercado.precioMedioM2)}, con un rango habitual entre ${formatCurrency(localidad.mercado.rangoMinM2)} y ${formatCurrency(localidad.mercado.rangoMaxM2)}. Esto significa que, por ejemplo, un piso de 100 m² podría tener un valor de mercado estimado entre ${formatCurrency(localidad.mercado.rangoMinM2 * 100)} y ${formatCurrency(localidad.mercado.rangoMaxM2 * 100)}, siempre sujeto a las condiciones particulares del inmueble.`,
        items: [
          `Precio medio estimado: ${formatCurrency(localidad.mercado.precioMedioM2)}/m²`,
          `Demanda actual: ${localidad.mercado.demanda}`,
          `Tiempo medio de venta: ${localidad.mercado.tiempoVentaMedio}`,
          `Tendencia: ${localidad.mercado.tendencia}`
        ]
      },
      {
        titulo: "Errores habituales al poner precio a una vivienda",
        contenido: "Muchos propietarios cometen errores que alargan la venta o reducen el precio final. Estos son los más frecuentes:",
        items: [
          "Sobrepreciar la vivienda por apego emocional o recuerdos de compra.",
          "Ignorar el estado real de conservación frente a la competencia.",
          "No tener en cuenta las reformas pendientes o los gastos que asumirá el comprador.",
          "Comparar con anuncios en lugar de con precios de venta reales cerrados."
        ]
      },
      {
        titulo: "¿Qué hace que una casa se venda más rápido en esta zona?",
        contenido: `En ${localidad.nombre}, los compradores valoran especialmente ${localidad.factoresClave.slice(0, 3).join("; ")}. Las viviendas que cumplen con estos criterios y se presentan bien suelen venderse en ${localidad.mercado.tiempoVentaMedio}, siempre que el precio esté ajustado al mercado.`,
        items: localidad.factoresClave
      },
      {
        titulo: "El proceso de venta con AR2",
        contenido: `Nuestro método en ${localidad.nombre} se adapta a cada propietario. Estos son los pasos que seguimos:`,
        items: [
          "Valoración gratuita y sin compromiso basada en datos reales.",
          "Informe de precio y estrategia de comercialización personalizada.",
          "Preparación del inmueble: fotografía, plano y descripción optimizada.",
          "Difusión selectiva en canales premium y visitas cualificadas.",
          "Acompañamiento en la negociación y en la firma ante notarío."
        ]
      }
    ],
    faqs: [
      {
        pregunta: `¿Es buen momento para vender mi casa en ${localidad.nombre}?`,
        respuesta: `La demanda en ${localidad.nombre} es ${localidad.mercado.demanda} y la tendencia es ${localidad.mercado.tendencia}. Si tu vivienda está bien ubicada y en buen estado, las probabilidades de venta son favorables.`
      },
      {
        pregunta: "¿Cuánto tarda una casa en venderse?",
        respuesta: `El tiempo medio estimado en ${localidad.nombre} es de ${localidad.mercado.tiempoVentaMedio}, aunque una vivienda bien valorada y presentada puede venderse antes.`
      },
      {
        pregunta: "¿Cobra AR2 por la valoración?",
        respuesta: "No. En AR2 la primera valoración es gratuita y sin compromiso. Solo cobramos si finalmente vendemos tu propiedad."
      }
    ],
    relacionadas: RELACIONADAS_VENTA[localidad.slug] || [`cuanto-vale-una-casa/${localidad.slug}`, "que-es-ar2"],
    cta: {
      texto: "Quiero vender mi casa con AR2",
      enlace: "/#contacto",
      descripcion: `Descubre cuánto puedes obtener por tu casa en ${localidad.nombre} y empieza a vender con un equipo experto.`
    }
  };
}

export const landingsMarca = [
  {
    slug: "que-es-ar2",
    tipo: "marca",
    ogType: "website",
    localidad: null,
    url: `${BASE_URL}/que-es-ar2`,
    titulo: "¿Qué es AR2 Consulting Inmobiliario? | Agencia premium en España",
    metaDescription: "AR2 Consulting es una agencia inmobiliaria premium especializada en la compra, venta y alquiler de inmuebles en España. Conoce nuestra metodología y valores.",
    fechaPublicacion: FECHA_PUBLICACION,
    fechaModificacion: FECHA_MODIFICACION,
    h1: "¿Qué es AR2 Consulting Inmobiliario?",
    introduccion: "AR2 Consulting Inmobiliario es una agencia especializada en operaciones inmobiliarias de calidad en España. Nacimos con el objetivo de transformar una experiencia que muchas veces resulta lenta, opaca y estresada, en un proceso claro, profesional y cercano. Trabajamos tanto con propietarios que quieren vender o alquilar su inmueble, como con compradores que buscan una propiedad a la altura de sus expectativas.",
    secciones: [
      {
        titulo: "Nuestra especialización",
        contenido: "En AR2 nos centramos en inmuebles residenciales y comerciales en ubicaciones de demanda. Nuestro equipo conoce a fondo mercados como Madrid, Barcelona, Valencia, Sevilla, Málaga y Jaén, y ofrece un servicio local con estándares internacionales.",
        items: [
          "Venta de pisos, casas, chalets, locales y oficinas.",
          "Alquiler de viviendas y propiedades comerciales.",
          "Valoración gratuita y estudios de mercado personalizados.",
          "Asesoramiento legal, fiscal y financiero durante toda la operación."
        ]
      },
      {
        titulo: "Metodología AR2",
        contenido: "Creemos que vender o comprar una propiedad es una decisión importante. Por eso, cada operación cuenta con un asesor senior que acompaña al cliente de principio a fin, desde la primera valoración hasta la firma ante notarío.",
        items: [
          "Análisis objetivo del valor de mercado.",
          "Estrategia de marketing selectiva y privacidad cuando se requiere.",
          "Fotografía, video y presentación profesional del inmueble.",
          "Negociación experta y gestión documental."
        ]
      },
      {
        titulo: "¿Por qué elegir AR2?",
        contenido: "Nuestros clientes valoran la transparencia, la comunicación constante y los resultados. No tratamos las propiedades como simples anuncios: analizamos cada caso para tomar las mejores decisiones en cada fase del proceso."
      }
    ],
    faqs: [
      {
        pregunta: "¿AR2 trabaja en toda España?",
        respuesta: "Sí. Aunque nuestra presencia es especialmente fuerte en Madrid, Barcelona, Valencia, Sevilla, Málaga y Jaén, gestionamos operaciones en otras zonas de España según las necesidades de nuestros clientes."
      },
      {
        pregunta: "¿Qué tipo de inmuebles gestiona AR2?",
        respuesta: "Trabajamos con viviendas de todo tipo, chalets, locales comerciales, oficinas, naves y terrenos. Nos especializamos en operaciones donde el asesoramiento personalizado aporta valor real."
      },
      {
        pregunta: "¿Cómo puedo contactar con AR2?",
        respuesta: "Puedes llamarnos al +34 640 08 15 99, escribirnos a info@ar2.es o rellenar el formulario de contacto de nuestra web."
      }
    ],
    relacionadas: ["equipo-ar2", "por-que-elegir-agencia-inmobiliaria-premium", "cuanto-vale-una-casa/las-rozas"],
    cta: {
      texto: "Hablar con un asesor",
      enlace: "/#contacto",
      descripcion: "Cuéntanos qué necesitas y un asesor senior de AR2 te contactará sin compromiso."
    }
  },
  {
    slug: "equipo-ar2",
    tipo: "marca",
    ogType: "website",
    localidad: null,
    url: `${BASE_URL}/equipo-ar2`,
    titulo: "Equipo AR2 Consulting | Asesores inmobiliarios senior en España",
    metaDescription: "Conoce al equipo de AR2 Consulting Inmobiliario: asesores senior con experiencia en operaciones premium, valoración de viviendas y cierre de operaciones en España.",
    fechaPublicacion: FECHA_PUBLICACION,
    fechaModificacion: FECHA_MODIFICACION,
    h1: "El equipo de AR2 Consulting",
    introduccion: "Detrás de cada operación de AR2 hay un equipo de profesionales con años de experiencia en el sector inmobiliario. Nuestros asesores combinan conocimiento técnico, negociación y cercanía para que cada cliente se sienta acompañado en una de las decisiones económicas más importantes de su vida.",
    secciones: [
      {
        titulo: "Asesores inmobiliarios senior",
        contenido: "Cada cliente tiene asignado un asesor senior que coordina todo el proceso. Este profesional conoce el mercado local, entiende la situación particular del cliente y toma decisiones estratégicas basadas en datos, no en intuición.",
        items: [
          "Experiencia contrastada en compra, venta y alquiler.",
          "Conocimiento profundo de los mercados locales.",
          "Capacidad de negociación orientada a resultados.",
          "Comunicación clara y reportes de avance periódicos."
        ]
      },
      {
        titulo: "Equipo de soporte especializado",
        contenido: "Además de los asesores comerciales, contamos con profesionales que aseguran que cada operación cumpla con los más altos estándares:",
        items: [
          "Marketing inmobiliario: fotografía, video y copywriting.",
          "Valoración y análisis de mercado.",
          "Asesoramiento legal y documental.",
          "Atención al cliente y postventa."
        ]
      },
      {
        titulo: "Nuestra filosofía de trabajo",
        contenido: "En AR2 creemos que la confianza se gaña con hechos. Por eso priorizamos la honestidad en la valoración, la transparencia en la comunicación y el compromiso con los resultados. Nuestro objetivo no es cerrar cualquier operación, sino la operación correcta para cada cliente."
      }
    ],
    faqs: [
      {
        pregunta: "¿Tendré un único interlocutor durante la venta?",
        respuesta: "Sí. Cada operación cuenta con un asesor referente que te acompaña durante todo el proceso, aunque detrás trabaja todo el equipo de soporte de AR2."
      },
      {
        pregunta: "¿El equipo tiene experiencia en operaciones premium?",
        respuesta: "Sí. Nuestros asesores han gestionado operaciones de alto nivel en capitales y zonas residenciales de prestigio, siempre con criterios de discreción y profesionalidad."
      },
      {
        pregunta: "¿Cómo puedo unirme al equipo de AR2?",
        respuesta: "Si tienes experiencia en el sector inmobiliario y compartes nuestros valores, puedes enviarnos tu currículum a info@ar2.es. Valoramos el talento, la ética y la orientación al cliente."
      }
    ],
    relacionadas: ["que-es-ar2", "opiniones-ar2-consulting", "cuanto-vale-una-casa/pozuelo-de-alarcon"],
    cta: {
      texto: "Contactar con el equipo",
      enlace: "/#contacto",
      descripcion: "Habla con un asesor senior de AR2 y descubre cómo podemos ayudarte."
    }
  },
  {
    slug: "por-que-elegir-agencia-inmobiliaria-premium",
    tipo: "marca",
    ogType: "website",
    localidad: null,
    url: `${BASE_URL}/por-que-elegir-agencia-inmobiliaria-premium`,
    titulo: "¿Por qué elegir una agencia inmobiliaria premium? | AR2",
    metaDescription: "Descubre las ventajas de contratar una agencia inmobiliaria premium como AR2: valoración realista, marketing selectivo, negociación experta y acompañamiento integral.",
    fechaPublicacion: FECHA_PUBLICACION,
    fechaModificacion: FECHA_MODIFICACION,
    h1: "¿Por qué elegir una agencia inmobiliaria premium?",
    introduccion: "Vender o comprar una propiedad es una de las operaciones económicas más importantes de una persona. No todas las agencias inmobiliarias ofrecen el mismo nivel de servicio, dedicación y resultados. Las agencias premium como AR2 están diseñadas para quienes buscan un proceso eficiente, discreto y con el máximo valor posible en cada fase.",
    secciones: [
      {
        titulo: "¿En qué se diferencia una agencia premium?",
        contenido: "Una agencia tradicional suele gestionar un alto volumen de inmuebles con procesos estandarizados. Una agencia premium invierte más tiempo y recursos en cada operación, priorizando la calidad sobre la cantidad.",
        items: [
          "Valoración profesional basada en datos reales de mercado.",
          "Marketing selectivo y presentación de alto nivel.",
          "Visitas cualificadas, no masivas.",
          "Asesoramiento legal, fiscal y de negociación personalizado."
        ]
      },
      {
        titulo: "Ventajas concretas de trabajar con AR2",
        contenido: "En AR2 aplicamos una metodología probada que se adapta a cada tipo de inmueble y cliente. Estas son algunas de las ventajas que aportamos:",
        items: [
          "Precio de salida ajustado a la realidad del mercado, sin sobrevalorar.",
          "Estrategia de comunicación privada cuando el cliente lo requiere.",
          "Preparación profesional del inmueble: fotografía, video y planos.",
          "Negociación experta para proteger tus intereses en cada oferta.",
          "Acompañamiento hasta la firma ante notarío."
        ]
      },
      {
        titulo: "¿Merece la pena pagar más comisión?",
        contenido: "La comisión de una agencia premium se justifica cuando el resultado final supera lo que se habría obtenido por cuenta propia o con una gestión estándar. Un precio de venta más alto, un cierre más rápido y menos contratiempos suelen compensar con creces la diferencia. En AR2 solo cobramos si vendemos tu propiedad."
      }
    ],
    faqs: [
      {
        pregunta: "¿Qué tipo de propiedades se gestionan en una agencia premium?",
        respuesta: "Suelen ser inmuebles de calidad en ubicaciones demandadas: pisos en zonas céntricas, chalets en urbanizaciones de prestigio, áticos, dúplex, propiedades singulares y activos de inversión."
      },
      {
        pregunta: "¿La agencia premium solo vende inmuebles de lujo?",
        respuesta: "No necesariamente. Lo que define una agencia premium es el nivel de servicio, no solo el precio del inmueble. En AR2 trabajamos con propiedades donde el asesoramiento personalizado aporta un valor real."
      },
      {
        pregunta: "¿Cómo empiezo a trabajar con AR2?",
        respuesta: "El primer paso es una valoración gratuita y sin compromiso. A partir de ahí, te presentamos una estrategia personalizada para tu propiedad."
      }
    ],
    relacionadas: ["que-es-ar2", "equipo-ar2", "opiniones-ar2-consulting"],
    cta: {
      texto: "Solicitar una valoración premium",
      enlace: "/#contacto",
      descripcion: "Descubre cómo AR2 puede maximizar el valor de tu propiedad con un servicio premium."
    }
  },
  {
    slug: "opiniones-ar2-consulting",
    tipo: "marca",
    ogType: "website",
    localidad: null,
    url: `${BASE_URL}/opiniones-ar2-consulting`,
    titulo: "Opiniones de AR2 Consulting | Clientes satisfechos en España",
    metaDescription: "Lee las opiniones de clientes de AR2 Consulting Inmobiliario. Descubre por qué confían en nuestros asesores para vender y comprar propiedades en España.",
    fechaPublicacion: FECHA_PUBLICACION,
    fechaModificacion: FECHA_MODIFICACION,
    h1: "Opiniones de AR2 Consulting",
    introduccion: "En AR2 medimos el éxito por la satisfacción de nuestros clientes. Cada operación inmobiliaria es única, y nuestro objetivo es que el propietario o comprador se sienta informado, acompañado y satisfecho con el resultado final. A continuación puedes conocer algunas de las experiencias de quienes ya han confiado en nosotros.",
    secciones: [
      {
        titulo: "Lo que valoran nuestros clientes",
        contenido: "Tras años de operaciones en Madrid y otras ciudades españolas, estos son los aspectos que más destacan quienes han trabajado con AR2:",
        items: [
          "Comunicación clara y reportes de avance constantes.",
          "Valoración realista que facilita la venta sin retrasos.",
          "Trato cercano y profesional durante todo el proceso.",
          "Capacidad de negociación que protege los intereses del cliente.",
          "Discreción y privacidad en operaciones sensibles."
        ]
      },
      {
        titulo: "Testimonios de clientes",
        contenido: "Estas son algunas opiniones representativas de propietarios y compradores que han pasado por AR2:",
        items: [
          "\"Vendimos nuestro piso en Madrid en menos de lo esperado y con un precio por encima de nuestra estimación inicial. El equipo de AR2 fue transparente desde el primer día.\" — Propietaria en Chamberí.",
          "\"Necesitaba comprar con rapidez y AR2 me ayudó a filtrar solo las opciones que encajaban con lo que buscaba. Sin perder tiempo en visitas innecesarias.\" — Comprador en Pozuelo.",
          "\"La valoración fue clave. Otros agentes nos habían dado cifras irreales; AR2 nos dio un precio profesional y cerramos en dos meses.\" — Propietario en Las Rozas."
        ]
      },
      {
        titulo: "Nuestro compromiso",
        contenido: "Cada opinión nos ayuda a seguir mejorando. Si has trabajado con AR2, nos encantaría conocer tu experiencia. Y si estás pensando en vender o comprar, puedes empezar con una valoración gratuita y sin compromiso."
      }
    ],
    faqs: [
      {
        pregunta: "¿Dónde puedo dejar mi opinión sobre AR2?",
        respuesta: "Puedes enviarnos tu experiencia a info@ar2.es o contactar directamente con tu asesor. Valoramos todos los comentarios para seguir mejorando."
      },
      {
        pregunta: "¿AR2 tiene reseñas en Google?",
        respuesta: "Estamos trabajando para centralizar las opiniones de nuestros clientes. Mientras tanto, puedes contactarnos directamente y te pondremos en contacto con referencias de clientes anteriores si lo deseas."
      },
      {
        pregunta: "¿Cómo garantiza AR2 la calidad de su servicio?",
        respuesta: "Cada operación cuenta con un asesor senior referente, seguimiento documental y revisión interna. Nuestro modelo solo cobra si se vende la propiedad, lo que alinea nuestros intereses con los del cliente."
      }
    ],
    relacionadas: ["que-es-ar2", "equipo-ar2", "por-que-elegir-agencia-inmobiliaria-premium"],
    cta: {
      texto: "Solicitar una valoración gratuita",
      enlace: "/#contacto",
      descripcion: "Únete a los clientes satisfechos de AR2 y descubre el valor real de tu propiedad."
    }
  }
];

export const landingsServicio = [
  {
    slug: "tasacion-gratuita-vivienda-madrid",
    tipo: "servicio",
    ogType: "website",
    localidad: null,
    url: `${BASE_URL}/tasacion-gratuita-vivienda-madrid`,
    titulo: "Tasación gratuita de viviendas en Madrid | AR2",
    metaDescription: "Solicita una tasación gratuita de tu vivienda en Madrid. AR2 te ofrece un informe de valoración realista basado en datos de mercado, sin compromiso.",
    fechaPublicacion: FECHA_PUBLICACION,
    fechaModificacion: FECHA_MODIFICACION,
    h1: "Tasación gratuita de viviendas en Madrid",
    introduccion: "Conocer el valor real de una vivienda es el primer paso para tomar decisiones inteligentes, ya sea que quieras vender, alquilar, refinanciar o simplemente tener una referencia actualizada. En AR2 ofrecemos tasaciones gratuitas en Madrid con un enfoque profesional, basado en datos de mercado y en el análisis específico de cada inmueble.",
    secciones: [
      {
        titulo: "¿Qué incluye nuestra tasación gratuita?",
        contenido: "Nuestra valoración no es una cifra sacada de un portal inmobiliario. Es un informe elaborado por profesionales que tienen en cuenta múltiples variables:",
        items: [
          "Estudio comparativo con ventas reales recientes en la zona.",
          "Análisis de la tipología, superficie, orientación y estado de conservación.",
          "Valoración de elementos diferenciales: terraza, garaje, trastero, ascensor, reformas.",
          "Revisión de la situación registral y posibles cargas.",
          "Recomendación de precio de salida y estrategia de venta."
        ]
      },
      {
        titulo: "¿Cómo funciona el proceso?",
        contenido: "Hemos simplificado el proceso para que obtener una tasación profesional sea rápido y cómodo:",
        items: [
          "1. Contactas con AR2 a través del formulario web o por teléfono.",
          "2. Un asesor recoge la información básica de la vivienda.",
          "3. Programamos una visita para conocer el inmueble in situ.",
          "4. Elaboramos el informe de valoración en un plazo breve.",
          "5. Te explicamos los resultados y respondemos a tus dudas."
        ]
      },
      {
        titulo: "¿Por qué elegir AR2 para tasar tu vivienda?",
        contenido: "Una tasación correcta marca la diferencia entre vender rápido o quedarse estancado en el mercado. En AR2 combinamos experiencia local, herramientas de análisis y criterio profesional para darte una cifra realista que sirva como base de decisión."
      }
    ],
    faqs: [
      {
        pregunta: "¿La tasación tiene algún coste?",
        respuesta: "No. La primera tasación de AR2 es gratuita y sin compromiso. Solo cobramos si finalmente nos encargas la venta del inmueble."
      },
      {
        pregunta: "¿Cuánto tarda en estar lista la tasación?",
        respuesta: "Depende de la complejidad del inmueble, pero normalmente el informe está listo en 24 a 72 horas tras la visita."
      },
      {
        pregunta: "¿Qué zonas de Madrid cubre AR2?",
        respuesta: "Realizamos tasaciones en Madrid capital y en municipios del noroeste como Las Rozas, Pozuelo de Alarcón, Majadahonda y El Escorial, además de otras zonas según demanda."
      }
    ],
    relacionadas: ["cuanto-vale-una-casa/las-rozas", "vender-casa/las-rozas", "que-es-ar2"],
    cta: {
      texto: "Solicitar tasación gratuita",
      enlace: "/#contacto",
      descripcion: "Obtén un informe profesional de valoración de tu vivienda en Madrid sin coste ni compromiso."
    }
  },
  {
    slug: "valorar-chalet-madrid",
    tipo: "servicio",
    ogType: "website",
    localidad: null,
    url: `${BASE_URL}/valorar-chalet-madrid`,
    titulo: "Cómo valorar un chalet en Madrid | Guía AR2",
    metaDescription: "Descubre cómo se valora un chalet en Madrid. Parcela, ubicación, calidades y entorno son clave. AR2 te explica el proceso y te ofrece valoración gratuita.",
    fechaPublicacion: FECHA_PUBLICACION,
    fechaModificacion: FECHA_MODIFICACION,
    h1: "Cómo valorar un chalet en Madrid",
    introduccion: "Valorar un chalet no es lo mismo que valorar un piso. Más allá de los metros cuadrados construidos, entran en juego factores como la parcela, la orientación, la privacidad, el estado de las instalaciones y la calidad de la urbanización. En Madrid, donde el mercado de chalets es muy heterogéneo, una valoración profesional es especialmente importante.",
    secciones: [
      {
        titulo: "Factores clave en la valoración de un chalet",
        contenido: "Cuando AR2 valora un chalet en Madrid, analizamos estos aspectos con especial detalle:",
        items: [
          "Superficie de parcela y posibilidades de ampliación o división.",
          "Metros construidos, distribución y número de plantas.",
          "Calidades de construcción, aislamiento e instalaciones.",
          "Estado de conservación y reformas realizadas.",
          "Orientación, vistas, privacidad y accesos.",
          "Ubicación de la urbanización y servicios cercanos."
        ]
      },
      {
        titulo: "Diferencias entre valorar un chalet y un piso",
        contenido: "En un piso, el valor se fija principalmente por zona, metros y estado. En un chalet, cada propiedad es más única. Dos chalets en la misma urbanización pueden tener precios muy distintos según la parcela, las reformas o las vistas. Por eso, la experiencia del valorador y el conocimiento del mercado local son fundamentales.",
        items: [
          "La parcela puede representar una parte importante del valor total.",
          "Las zonas comunes y la urbanización influyen en la percepción del comprador.",
          "El mantenimiento de piscina, jardín y instalaciones afecta al precio.",
          "La demanda de chalets varía según la época del año y el entorno."
        ]
      },
      {
        titulo: "Zonas de Madrid con mayor demanda de chalets",
        contenido: "Las zonas más demandadas para la compra de chalets en Madrid suelen estar en el noroeste de la capital y en municipios como Las Rozas, Pozuelo de Alarcón, Majadahonda y El Escorial. En estas áreas, los compradores buscan espacio, tranquilidad y buena conexión con el centro.",
        items: ["Las Rozas: perfil familiar y buena oferta educativa.", "Pozuelo de Alarcón: máximo nivel adquisitivo y urbanizaciones de lujo.", "Majadahonda: equilibrio entre espacio, servicios y cercanía a Madrid.", "El Escorial: entorno natural y opciones de segunda residencia."]
      }
    ],
    faqs: [
      {
        pregunta: "¿Cuánto puede variar el precio de dos chalets en la misma zona?",
        respuesta: "Puede variar considerablemente. Factores como el tamaño de la parcela, las calidades, las reformas, las vistas o la privacidad pueden suponer diferencias del 20 %, 30 % o más respecto a la media."
      },
      {
        pregunta: "¿Es necesario visitar el chalet para valorarlo?",
        respuesta: "Sí. Aunque se puede dar una estimación inicial con fotos y datos, una valoración profesional requiere visitar el inmueble para evaluar todos los factores que influyen en el precio."
      },
      {
        pregunta: "¿AR2 valora chalets fuera de Madrid capital?",
        respuesta: "Sí. Realizamos valoraciones de chalets en el noroeste de Madrid y en otras zonas de España donde AR2 tiene presencia o red de colaboradores."
      }
    ],
    relacionadas: ["tasacion-gratuita-vivienda-madrid", "cuanto-vale-una-casa/las-rozas", "vender-casa/las-rozas"],
    cta: {
      texto: "Valorar mi chalet con AR2",
      enlace: "/#contacto",
      descripcion: "Obtén una valoración profesional de tu chalet en Madrid basada en todos los factores que realmente importan."
    }
  },
  {
    slug: "comprar-casa-madrid-extranjeros",
    tipo: "servicio",
    ogType: "website",
    localidad: null,
    url: `${BASE_URL}/comprar-casa-madrid-extranjeros`,
    titulo: "Cómo comprar casa en Madrid siendo extranjero | Guía AR2",
    metaDescription: "Guía completa para extranjeros que quieren comprar casa en Madrid. Requisitos, financiación, zonas recomendadas y tramitación con AR2.",
    fechaPublicacion: FECHA_PUBLICACION,
    fechaModificacion: FECHA_MODIFICACION,
    h1: "Cómo comprar casa en Madrid siendo extranjero",
    introduccion: "Madrid es uno de los destinos preferidos por extranjeros para comprar vivienda en España. Ya sea como inversión, segunda residencia o nuevo hogar, el proceso es accesible, pero requiere conocer los requisitos legales, la financiación disponible y las particularidades del mercado local. En AR2 acompañamos a compradores internacionales durante todo el proceso, desde la búsqueda hasta la escritura.",
    secciones: [
      {
        titulo: "Requisitos legales para comprar siendo extranjero",
        contenido: "Comprar una vivienda en Madrid como extranjero es posible tanto para residentes como para no residentes. Estos son los aspectos más importantes:",
        items: [
          "Número de identificación de extranjero (NIE), obligatorio para firmar la escritura.",
          "Cuenta bancaria en España para pagos y domiciliación de impuestos.",
          "Documentación acreditativa de la procedencia de fondos.",
          "Representación legal o poder notarial si no puedes estar presente."
        ]
      },
      {
        titulo: "Financiación para extranjeros",
        contenido: "La financiación bancaria en España para no residentes suele ser menor que para residentes. Normalmente los bancos financian hasta el 60-70 % del valor de tasación, aunque cada caso depende del perfil del comprador y del banco.",
        items: [
          "Aportación propia necesaria: generalmente del 30-40 %.",
          "Justificación de ingresos estable en el país de origen.",
          "Posibilidad de vincular productos bancarios para mejorar condiciones.",
          "Asesoramiento hipotecario recomendado antes de buscar propiedades."
        ]
      },
      {
        titulo: "Zonas recomendadas para extranjeros en Madrid",
        contenido: "La elección de zona depende del objetivo de la compra. Estas son algunas de las zonas más demandadas por compradores internacionales:",
        items: [
          "Salamanca: elegancia, servicios de lujo y excelente ubicación.",
          "Chamberí: encanto urbano, edificios históricos y vida local.",
          "Pozuelo de Alarcón y Majadahonda: zonas familiares de alto standing.",
          "Centro y Retiro: inversión y alquiler turístico o residencial."
        ]
      },
      {
        titulo: "Cómo te ayuda AR2",
        contenido: "En AR2 gestionamos compras para clientes internacionales de forma integral: búsqueda personalizada, visitas cualificadas, negociación, revisión legal y acompañamiento en la firma. También podemos coordinar con abogados, gestores y entidades bancarias para que el proceso sea lo más sencillo posible."
      }
    ],
    faqs: [
      {
        pregunta: "¿Puedo comprar en Madrid si no resido en España?",
        respuesta: "Sí. Tanto residentes como no residentes pueden comprar vivienda en España. Lo más importante es contar con el NIE y una cuenta bancaria española."
      },
      {
        pregunta: "¿Hay impuestos especiales para extranjeros?",
        respuesta: "Los impuestos asociados a la compra son los mismos para residentes y no residentes: ITP en compra de segunda mano o IVA en vivienda nueva, más gastos notariales y registrales. La fiscalidad posterior puede variar según la residencia fiscal."
      },
      {
        pregunta: "¿AR2 trabaja con compradores de otros países?",
        respuesta: "Sí. En AR2 acompañamos a compradores internacionales en todo el proceso, con comunicación clara y coordinación con los profesionales necesarios."
      }
    ],
    relacionadas: ["cuanto-vale-una-casa/salamanca", "alquiler-o-compra-madrid", "tasacion-gratuita-vivienda-madrid"],
    cta: {
      texto: "Asesoramiento para compradores internacionales",
      enlace: "/#contacto",
      descripcion: "Contacta con AR2 y recibe asesoramiento personalizado para comprar casa en Madrid siendo extranjero."
    }
  },
  {
    slug: "alquiler-o-compra-madrid",
    tipo: "servicio",
    ogType: "website",
    localidad: null,
    url: `${BASE_URL}/alquiler-o-compra-madrid`,
    titulo: "¿Alquilar o comprar en Madrid? | Análisis AR2 2025",
    metaDescription: "Análisis completo para decidir si alquilar o comprar en Madrid. Factores económicos, personales y de mercado según AR2 Consulting.",
    fechaPublicacion: FECHA_PUBLICACION,
    fechaModificacion: FECHA_MODIFICACION,
    h1: "¿Alquilar o comprar en Madrid?",
    introduccion: "Decidir si alquilar o comprar una vivienda en Madrid depende de múltiples factores: estabilidad laboral, ahorros disponibles, expectativas de permanencia y evolución del mercado inmobiliario. No existe una respuesta única, pero sí una forma de analizar la decisión con datos. En AR2 ayudamos a compradores e inversores a tomar decisiones informadas basadas en su situación particular.",
    secciones: [
      {
        titulo: "Factores económicos a considerar",
        contenido: "La decisión financiera entre alquilar y comprar debe comparar no solo la cuota mensual versus el alquiler, sino también otros conceptos:",
        items: [
          "Ahorro disponible para la entrada y gastos asociados.",
          "Estabilidad de ingresos y capacidad de endeudamiento.",
          "Costes de mantenimiento, comunidad, IBI y seguros en la compra.",
          "Coste de oportunidad del dinero invertido en la entrada.",
          "Evolución esperada del precio de la vivienda y de los tipos de interés."
        ]
      },
      {
        titulo: "¿Cuándo tiene más sentido comprar?",
        contenido: "Comprar suele ser la mejor opción cuando existe estabilidad a medio-largo plazo y se dispone de ahorros suficientes. Estas son situaciones favorables:",
        items: [
          "Planeas vivir en Madrid al menos 5-7 años.",
          "Tienes ahorro equivalente al 20-30 % del precio de la vivienda.",
          "Tu situación laboral es estable.",
          "Quieres estabilidad y libertad para reformar o personalizar."
        ]
      },
      {
        titulo: "¿Cuándo tiene más sentido alquilar?",
        contenido: "Alquilar puede ser más inteligente en ciertas circunstancias personales o profesionales:",
        items: [
          "No tienes claro tu lugar de residencia a medio plazo.",
          "Prefieres flexibilidad laboral o geográfica.",
          "No dispones de ahorros suficientes para una compra cómoda.",
          "Los precios de compra están muy altos respecto a la renta disponible."
        ]
      },
      {
        titulo: "Situación del mercado inmobiliario en Madrid",
        contenido: "Madrid es un mercado consolidado con demanda sostenida. Aunque los precios han crecido en los últimos años, la financiación y la estabilidad económica influyen mucho en la capacidad de compra. En AR2 analizamos cada caso particular para recomendar la opción más adecuada."
      }
    ],
    faqs: [
      {
        pregunta: "¿Es mejor comprar o alquilar en Madrid en 2025?",
        respuesta: "Depende de tu situación personal y financiera. Si tienes estabilidad y ahorros, comprar puede ser una buena inversión a largo plazo. Si prefieres flexibilidad, alquilar te da más libertad."
      },
      {
        pregunta: "¿Cuánto debo ahorrar para comprar un piso en Madrid?",
        respuesta: "Generalmente se recomienda contar con el 20-30 % del precio de la vivienda para entrada y gastos asociados, aunque existen opciones con menos aportación según el perfil."
      },
      {
        pregunta: "¿AR2 asesora tanto a compradores como a inquilinos?",
        respuesta: "Principalmente asesoramos a compradores, vendedores e inversores. Si buscas alquilar, podemos orientarte sobre zonas y rentabilidad, aunque nuestro foco es la compraventa."
      }
    ],
    relacionadas: ["comprar-casa-madrid-extranjeros", "cuanto-vale-una-casa/chamberi", "tasacion-gratuita-vivienda-madrid"],
    cta: {
      texto: "Asesoramiento personalizado",
      enlace: "/#contacto",
      descripcion: "Habla con un asesor de AR2 y recibe un análisis personalizado para decidir si alquilar o comprar en Madrid."
    }
  }
];

export const landings = [
  ...localidades.flatMap((localidad) => [
    generarLandingValor(localidad),
    generarLandingVenta(localidad),
  ]),
  ...landingsMarca,
  ...landingsServicio,
];
