import { useState, useEffect, useContext } from "react";
import { InmueblesContext } from "../components/InmueblesProvider";
import { fetchAllInmuebles } from "../lib/fetchInmuebles.js";

// ================= HOOK useInmuebles =================
export const useInmuebles = () => {
  const context = useContext(InmueblesContext);

  const [inmuebles, setInmuebles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (context !== null) return;

    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllInmuebles();
        if (isMounted) {
          setInmuebles(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error cargando inmuebles:", err);
        if (isMounted) {
          setError(err.message || "Error desconocido al cargar los datos");
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [context]);

  if (context !== null) {
    return context;
  }

  return { inmuebles, loading, error };
};

export default useInmuebles;
