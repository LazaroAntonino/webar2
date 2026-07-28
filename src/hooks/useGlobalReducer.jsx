import { useContext } from "react";
import { StoreContext } from "../components/StoreProvider";

// Custom hook to access the global state and dispatch function.
export default function useGlobalReducer() {
    const { dispatch, store } = useContext(StoreContext)
    return { dispatch, store };
}
