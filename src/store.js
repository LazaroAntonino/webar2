// Estado global de la aplicación AR2 Consulting
// Preparado para uso futuro (favoritos, usuario, etc.)

export const initialStore = () => {
  return {
    // Favoritos del usuario
    favoritos: [],
    // Usuario autenticado (futuro)
    usuario: null,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "ADD_FAVORITO":
      return {
        ...store,
        favoritos: [...store.favoritos, action.payload],
      };

    case "REMOVE_FAVORITO":
      return {
        ...store,
        favoritos: store.favoritos.filter((id) => id !== action.payload),
      };

    case "SET_USUARIO":
      return {
        ...store,
        usuario: action.payload,
      };

    default:
      return store;
  }
}
