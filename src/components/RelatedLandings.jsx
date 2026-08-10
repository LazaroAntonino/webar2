import { Link } from "react-router-dom";
import { getRelatedLandings } from "../data/landings";
import { ArrowRight } from "phosphor-react";

export function RelatedLandings({ slugs }) {
  const related = getRelatedLandings(slugs);

  if (related.length === 0) return null;

  return (
    <section className="landing-related">
      <div className="landing-related__container">
        <h2 className="landing-related__title">También te puede interesar</h2>
        <div className="landing-related__grid">
          {related.map((item) => (
            <article key={item.slug} className="landing-related__card">
              <Link
                to={`/${item.slug}`}
                className="landing-related__link"
                aria-label={`Leer más sobre ${item.h1}`}
              >
                <h3 className="landing-related__card-title">{item.h1}</h3>
                <p className="landing-related__card-desc">{item.metaDescription}</p>
                <span className="landing-related__card-cta">
                  Leer más <ArrowRight size={16} weight="bold" aria-hidden="true" />
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RelatedLandings;
