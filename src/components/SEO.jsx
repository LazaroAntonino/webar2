import React from "react";
import { Helmet } from "react-helmet-async";

const BASE_URL = "https://ar2house.com";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export default function SEO({
  title,
  description,
  image,
  url,
  type = "website",
  jsonLd,
  noindex = false,
}) {
  const resolvedImage = image || DEFAULT_IMAGE;
  const resolvedUrl = url ? (url.startsWith("http") ? url : `${BASE_URL}${url}`) : undefined;

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {resolvedUrl && <link rel="canonical" href={resolvedUrl} />}

      {/* Open Graph */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      {resolvedUrl && <meta property="og:url" content={resolvedUrl} />}
      <meta property="og:image" content={resolvedImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={resolvedImage} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd).replace(/<\/script>/gi, '<\\/script>')}
        </script>
      )}
    </Helmet>
  );
}
