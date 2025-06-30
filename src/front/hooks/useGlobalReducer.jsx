// Import necessary hooks and functions from React.
import {
  useContext,
  useReducer,
  createContext,
  useEffect,
  useMemo,
} from "react";
import storeReducer, { initialStore } from "../store"; // Import the reducer and the initial state.

// Create a context to hold the global state of the application
// We will call this global state the "store" to avoid confusion while using local states
const StoreContext = createContext();

// Define a provider component that encapsulates the store and warps it in a context provider to
// broadcast the information throught all the app pages and components.
export function StoreProvider({ children }) {
  // Initialize reducer with the initial state.
  const [store, dispatch] = useReducer(storeReducer, initialStore());

  // *************
  const actions = useMemo(() => {
    const allActions = {
      // Definimos un objeto temporal para contener todas las acciones
      // Autenticación
      login: async (email, password) => {
        try {
          const resp = await fetch(`${process.env.VITE_BACKEND_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await resp.json();
          if (resp.ok) {
            localStorage.setItem("jwt_token", data.token);
            dispatch({
              type: "LOGIN",
              payload: { token: data.token, user_data: data.user_id },
            });

            //     await allActions.transferLocalCartToBackend();
            //     await allActions.getBackendCart();
            //     return true;
            //   } else {
            //     console.error("Error de login desde el backend:", data.msg);
            //     return false;
            //   }
            // } catch (error) {
            //   console.error("Error de red o servidor durante el login:", error);
            //   return false;
            // }
            await allActions.transferLocalCartToBackend();
            await allActions.getBackendCart();
            return true;
          } else {
            console.error("Error de login desde el backend:", data.msg);
            return false;
          }
        } catch (error) {
          console.error("Error de red o servidor durante el login:", error);
          return false;
        }
      },
      logout: () => {
        dispatch({ type: "LOGOUT" });
      },
      getUserInfo: async () => {
        const token = store.token || localStorage.getItem("jwt_token");
        if (!token) return false;
        try {
          const response = await fetch(`${process.env.VITE_BACKEND_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) {
            if (response.status === 401) {
              allActions.logout();
            }
            throw new Error("Fallo al obtener la información del usuario");
          }
          const data = await response.json();
          dispatch({ type: "ADD_ME", payload: data });
          return true;
        } catch (error) {
          console.error("Error al obtener información del usuario:", error);
          allActions.logout();
          return false;
        }
      },

      addToCart: async (product, quantity = 1) => {
        if (store.token && store.user) {
          try {
            const response = await fetch(
              `${process.env.VITE_BACKEND_URL}/api/cart`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${store.token}`,
                },
                body: JSON.stringify({ product_id: product.id, quantity }),
              }
            );
            if (!response.ok)
              throw new Error("Fallo al añadir al carrito del backend");
            await allActions.getBackendCart();
            return true;
          } catch (error) {
            console.error("Error añadiendo al carrito del backend:", error);
            return false;
          }
        } else {
          dispatch({ type: "ADD_LOCAL_CART_ITEM", payload: product });
          return true;
        }
      },
      removeCartItem: async (itemId) => {
        if (store.token && store.user) {
          try {
            const response = await fetch(
              `${process.env.VITE_BACKEND_URL}/api/cart/${itemId}`,
              {
                method: "DELETE",
                headers: { Authorization: `Bearer ${store.token}` },
              }
            );
            if (!response.ok)
              throw new Error("Fallo al eliminar del carrito del backend");
            await allActions.getBackendCart();
            return true;
          } catch (error) {
            console.error("Error eliminando del carrito del backend:", error);
            return false;
          }
        } else {
          dispatch({ type: "REMOVE_LOCAL_CART_ITEM", payload: itemId });
          return true;
        }
      },
      clearCart: async () => {
        if (store.token && store.user) {
          try {
            const response = await fetch(
              `${process.env.VITE_BACKEND_URL}/api/cart/clear`,
              {
                method: "DELETE",
                headers: { Authorization: `Bearer ${store.token}` },
              }
            );
            if (!response.ok)
              throw new Error("Fallo al vaciar el carrito del backend");
            await allActions.getBackendCart();
            return true;
          } catch (error) {
            console.error("Error vaciando el carrito del backend:", error);
            return false;
          }
        } else {
          dispatch({ type: "CLEAR_LOCAL_CART" });
          return true;
        }
      },

      // Acciones para obtener y sincronizar carritos
      syncLocalCartWithStore: () => {
        const cart = JSON.parse(localStorage.getItem("local_cart") || "[]");
        dispatch({ type: "SET_LOCAL_CART", payload: cart });
      },
      getBackendCart: async () => {
        if (!store.token) {
          console.log(
            "No hay token, no se puede obtener el carrito del backend."
          );
          dispatch({ type: "SET_BACKEND_CART", payload: [] });
          return;
        }
        try {
          const response = await fetch(
            `${process.env.VITE_BACKEND_URL}/api/cart`,
            {
              headers: { Authorization: `Bearer ${store.token}` },
            }
          );
          if (!response.ok) {
            if (response.status === 401) {
              allActions.logout();
            }
            throw new Error("Fallo al obtener el carrito del backend");
          }
          const data = await response.json();
          dispatch({ type: "SET_BACKEND_CART", payload: data });
        } catch (error) {
          console.error("Error al obtener el carrito del backend:", error);
          dispatch({ type: "SET_BACKEND_CART", payload: [] });
        }
      },
      transferLocalCartToBackend: async () => {
        const localCart = store.localCart;
        if (localCart.length === 0 || !store.token || !store.user) {
          return;
        }

        for (const item of localCart) {
          await allActions.addBackendCartItem(item.product_id, item.quantity);
        }
        allActions.clearCart();
      },
      addBackendCartItem: async (product_id, quantity = 1) => {
        const token = store.token || localStorage.getItem("jwt_token");
        if (!token) {
          console.error("No hay token disponible para addBackendCartItem");
          return false;
        }
        try {
          const response = await fetch(
            `${process.env.VITE_BACKEND_URL}/api/cart`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ product_id, quantity }),
            }
          );
          if (!response.ok) {
            throw new Error("Fallo al añadir el item al carrito del backend");
          }
          return true;
        } catch (error) {
          console.error("Error añadiendo item en addBackendCartItem:", error);
          return false;
        }
      },
    };
    return allActions;
  }, [store.token, store.user, store.localCart, dispatch]);

  useEffect(() => {
    if (actions) {
      actions.getUserInfo();
      actions.syncLocalCartWithStore();
    }
  }, []);

  // *************

  // Provide the store and dispatch method to all child components.
  return (
    <StoreContext.Provider value={{ store, dispatch, actions }}>
      {children}
    </StoreContext.Provider>
  );
}

// Custom hook to access the global state and dispatch function.
export default function useGlobalReducer() {
  const { dispatch, store, actions } = useContext(StoreContext);
  return { dispatch, store, actions };
}
