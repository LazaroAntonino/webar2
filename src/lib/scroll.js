// Helper para navegar a la home y hacer scroll a una sección por hash.
// Reproduce el comportamiento de MainNavbar para enlaces internos con hash.

let lastScrollId = 0;

export function navigateToHash(navigate, hash) {
  if (!hash) return;

  const targetId = hash.replace("#", "");
  const scrollId = ++lastScrollId;

  // Si ya estamos en home, scrollear directamente
  if (typeof window !== "undefined" && window.location.pathname === "/") {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    return;
  }

  // Si estamos en otra página, navegar a home y scrollear tras el montaje
  navigate("/" + hash);

  if (typeof window === "undefined") return;

  const attemptScroll = (delay) => {
    setTimeout(() => {
      if (scrollId !== lastScrollId) return;
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, delay);
  };

  attemptScroll(150);
  attemptScroll(400);
  attemptScroll(800);
}
