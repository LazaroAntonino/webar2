import { MainNavbar } from "../components/MainNavbar";
import { Footer } from "../components/Footer";
import SEO from "../components/SEO";
import { SITE } from "../data/site.js";
import "./LegalPage.css";

const CONTENT = {
  "aviso-legal": {
    title: "Aviso Legal | AR2 Consulting Inmobiliario",
    description: "Aviso legal del sitio web de AR2 Consulting Inmobiliario. Información sobre titularidad, condiciones de uso y propiedad intelectual.",
    h1: "Aviso Legal",
    sections: [
      {
        title: "1. Datos identificativos",
        text: `El presente sitio web es titularidad de ${SITE.legalName}${
          SITE.cif ? `, con CIF ${SITE.cif}` : ""
        }${
          SITE.address.street
            ? ` y domicilio en ${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city} (${SITE.address.region})`
            : ""
        }. Puedes contactar con nosotros a través del teléfono ${SITE.phone} o del correo electrónico ${SITE.email}.`,
      },
      {
        title: "2. Condiciones de uso",
        text: "El acceso y uso de este sitio web atribuye la condición de usuario, quien acepta, desde dicho acceso y uso, las condiciones generales de uso aquí reflejadas. Estas condiciones serán de aplicación independientemente de las condiciones generales de contratación que en su caso resulten de aplicación.",
      },
      {
        title: "3. Propiedad intelectual e industrial",
        text: "Todos los contenidos de este sitio web, incluyendo textos, fotografías, gráficos, logotipos, iconos, software y cualquier otro material, son propiedad de AR2 Consulting o de terceros que han autorizado su inclusión. Queda prohibida su reproducción, distribución, comunicación pública y transformación, total o parcial, sin autorización expresa.",
      },
      {
        title: "4. Responsabilidad",
        text: "AR2 Consulting no se hace responsable de los daños y perjuicios de cualquier naturaleza que pudieran derivarse del acceso o uso incorrecto de los contenidos de este sitio web. La información contenida tiene carácter meramente informativo y no constituye asesoramiento legal, fiscal o financiero.",
      },
    ],
  },
  privacidad: {
    title: "Política de Privacidad | AR2 Consulting Inmobiliario",
    description: "Política de privacidad de AR2 Consulting Inmobiliario. Información sobre el tratamiento de datos personales y derechos de los usuarios.",
    h1: "Política de Privacidad",
    sections: [
      {
        title: "1. Responsable del tratamiento",
        text: "El responsable del tratamiento de los datos personales recogidos a través de este sitio web es AR2 Consulting Inmobiliario. Puedes contactar con nosotros en el teléfono " + SITE.phone + " o en el correo " + SITE.email + ".",
      },
      {
        title: "2. Finalidad del tratamiento",
        text: "Los datos personales que nos facilitas a través del formulario de contacto o de cualquier otro medio serán tratados con la finalidad de atender tus consultas, gestionar los servicios solicitados y mantenerte informado sobre nuestras actividades, siempre que nos hayas dado tu consentimiento.",
      },
      {
        title: "3. Legitimación",
        text: "La base legal para el tratamiento de tus datos es tu consentimiento, expresado al enviarnos el formulario, y la gestión de la relación contractual o precontractual en caso de solicitar nuestros servicios.",
      },
      {
        title: "4. Conservación de los datos",
        text: "Tus datos se conservarán durante el tiempo necesario para cumplir con la finalidad para la que fueron recogidos y para determinar las posibles responsabilidades que pudieran derivarse de dicha finalidad.",
      },
      {
        title: "5. Derechos de los usuarios",
        text: "Tienes derecho a acceder, rectificar, suprimir, oponerte, limitar el tratamiento y solicitar la portabilidad de tus datos. Para ejercer estos derechos, puedes escribirnos a " + SITE.email + ".",
      },
      {
        title: "6. Seguridad",
        text: "AR2 Consulting adopta las medidas técnicas y organizativas necesarias para garantizar la seguridad de los datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado.",
      },
    ],
  },
  cookies: {
    title: "Política de Cookies | AR2 Consulting Inmobiliario",
    description: "Política de cookies de AR2 Consulting Inmobiliario. Información sobre qué son las cookies y cómo las utilizamos.",
    h1: "Política de Cookies",
    sections: [
      {
        title: "1. ¿Qué son las cookies?",
        text: "Las cookies son pequeños archivos de texto que se almacenan en el dispositivo del usuario cuando visita un sitio web. Sirven para recordar preferencias, mejorar la experiencia de navegación y obtener información estadística.",
      },
      {
        title: "2. Tipos de cookies que utilizamos",
        text: "En este sitio web utilizamos cookies técnicas, necesarias para el correcto funcionamiento de la web, y cookies analíticas, que nos permiten conocer el comportamiento de los usuarios y mejorar nuestros servicios.",
      },
      {
        title: "3. Gestión de cookies",
        text: "Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de tu navegador. Ten en cuenta que desactivar algunas cookies puede afectar al funcionamiento de ciertas partes del sitio web.",
      },
      {
        title: "4. Cookies de terceros",
        text: "Este sitio web puede utilizar servicios de terceros, como Google Analytics, que recopilan información con fines estadísticos. Estos servicios pueden utilizar cookies propias gestionadas por las plataformas correspondientes.",
      },
      {
        title: "5. Más información",
        text: "Si tienes dudas sobre nuestra política de cookies, puedes contactar con nosotros en " + SITE.email + ".",
      },
    ],
  },
};

export function LegalPage({ page }) {
  const content = CONTENT[page];
  if (!content) return null;

  return (
    <div className="legal-page">
      <SEO
        title={content.title}
        description={content.description}
        url={`${SITE.baseUrl}/${page}`}
        noindex
      />
      <MainNavbar alwaysSolid />
      <main className="legal-main">
        <div className="container">
          <h1 className="legal-title">{content.h1}</h1>
          {content.sections.map((section, index) => (
            <section key={index} className="legal-section">
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LegalPage;
