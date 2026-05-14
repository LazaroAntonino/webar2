#!/usr/bin/env node
// Remove bare "import React from 'react';" from files where React is not otherwise used
import { readFileSync, writeFileSync } from "fs";

const files = [
  "src/main.jsx",
  "src/routes.jsx",
  "src/pages/Home.jsx",
  "src/pages/Properties.jsx",
  "src/pages/PropertyDetail.jsx",
  "src/components/Footer.jsx",
  "src/components/MainNavbar.jsx",
  "src/components/PropertyCard.jsx",
  "src/components/PropertyFilters.jsx",
  "src/components/SEO.jsx",
  "src/components/ValuationModal.jsx",
  "src/hooks/useInmuebles.jsx",
  "src/hooks/useGlobalReducer.jsx",
];

for (const f of files) {
  let content = readFileSync(f, "utf8");
  // Remove the bare React import line (React 17+ new JSX transform doesn't need it)
  const newContent = content.replace(/^import React from ["']react["'];\n/m, "");
  if (newContent !== content) {
    writeFileSync(f, newContent, "utf8");
    console.log("Removed React import from:", f);
  } else {
    console.log("No bare React import in:", f);
  }
}
