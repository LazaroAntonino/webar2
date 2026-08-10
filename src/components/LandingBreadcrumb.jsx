import { Link } from "react-router-dom";
import { CaretRight } from "phosphor-react";

const CATEGORY_LABELS = {
  "valor-mercado": "Valoración",
  "vender-casa": "Vender casa",
  marca: "AR2",
  servicio: "Guías",
};

export function LandingBreadcrumb({ landing }) {
  const items = [{ label: "Inicio", to: "/" }];

  const categoryLabel = CATEGORY_LABELS[landing.tipo];
  if (categoryLabel) {
    items.push({ label: categoryLabel, to: null });
  }

  items.push({ label: landing.localidad || landing.h1, to: null, active: true });

  return (
    <nav className="breadcrumb" aria-label="Ruta de navegación">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label + index} className="breadcrumb__segment">
            {item.to && !isLast ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span className={isLast ? "breadcrumb__current" : ""} aria-current={isLast ? "page" : undefined}>
                {item.label}
              </span>
            )}
            {!isLast && <CaretRight size={14} aria-hidden="true" />}
          </span>
        );
      })}
    </nav>
  );
}

export default LandingBreadcrumb;
