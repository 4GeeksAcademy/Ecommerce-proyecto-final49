import {
  useContext,
  useReducer,
  createContext,
  useEffect,
  useMemo,
} from "react";
import storeReducer, { initialStore } from "../store.js";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [store, dispatch] = useReducer(storeReducer, initialStore());

  const actions = useMemo(() => {
    const allActions = {
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
            // El dispatch de LOGIN aquí es correcto
            dispatch({
              type: "LOGIN",
              payload: { token: data.token, user_data: data.user_id },
            });
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
        localStorage.removeItem("jwt_token");
        dispatch({ type: "LOGOUT" });
        dispatch({ type: "SET_BACKEND_CART", payload: [] });
        dispatch({ type: "ADD_ME", payload: null });
      },
      getUserInfo: async (tokenArg) => {
        const token = tokenArg || localStorage.getItem("jwt_token");
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

        const token = store.token || localStorage.getItem("jwt_token");
        if (token && store.user) {
          try {
            const response = await fetch(
              `${process.env.VITE_BACKEND_URL}/api/cart`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ product_id: product.id, quantity }),
              }
            );
            if (!response.ok)
              throw new Error("Fallo al añadir al carrito del backend");
            await allActions.getBackendCart(token);
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
        const token = store.token || localStorage.getItem("jwt_token");
        if (token && store.user) {
          try {
            const response = await fetch(
              `${process.env.VITE_BACKEND_URL}/api/cart/${itemId}`,
              {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (!response.ok)
              throw new Error("Fallo al eliminar del carrito del backend");
            await allActions.getBackendCart(token);
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
        const token = store.token || localStorage.getItem("jwt_token");
        if (token && store.user) {
          try {
            const response = await fetch(
              `${process.env.VITE_BACKEND_URL}/api/cart/clear`,
              {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (!response.ok)
              throw new Error("Fallo al vaciar el carrito del backend");
            await allActions.getBackendCart(token);
            return true;
          } catch (error) {
            console.error("Error vaciando el carrito del backend:", error);
            return false;
          }
        } else {
          // Línea 145, se adiciona un console.log por validación de duplicidad de item en carrito.
          console.log("Agregando al carrito local (usuario no logeado)");
          dispatch({ type: "CLEAR_LOCAL_CART" });
          return true;
        }
      },

      syncLocalCartWithStore: () => {
        const cart = JSON.parse(localStorage.getItem("local_cart") || "[]");
        dispatch({ type: "SET_LOCAL_CART", payload: cart });
      },

      getBackendCart: async (tokenArg) => {
        const token = tokenArg || localStorage.getItem("jwt_token");
        if (!token) {
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
              headers: { Authorization: `Bearer ${token}` },
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

      transferLocalCartToBackend: async (tokenArg) => {
        const localCart = store.localCart;
        const token = tokenArg || localStorage.getItem("jwt_token");
        if (localCart.length === 0 || !token || !store.user) {
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
  }, [store.localCart, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token && !store.token) {

      dispatch({ type: "LOGIN", payload: { token: token, user_data: null } });
    }
    if (store.token) {
      actions.getUserInfo(store.token);
    } else {
      dispatch({ type: "ADD_ME", payload: null });
    }
  }, [store.token, actions]);

  useEffect(() => {
    actions.syncLocalCartWithStore();
  }, []);

  useEffect(() => {
    if (store.token && store.user) {
      actions.getBackendCart(store.token);

      if (store.localCart.length > 0) {
        actions.transferLocalCartToBackend(store.token);
      }
    } else {
      // Si no hay token o usuario, asegurarse de que el carrito de backend esté vacío
      dispatch({ type: "SET_BACKEND_CART", payload: [] });
    }
  }, [store.token, store.user, store.localCart.length, actions]); // Añadida dependencia localCart.length para reaccionar a cambios en el carrito local

  return (
    <StoreContext.Provider value={{ store, dispatch, actions }}>
      {children}
    </StoreContext.Provider>
  );
}

export default function useGlobalReducer() {
  const { dispatch, store, actions } = useContext(StoreContext);
  return { dispatch, store, actions };
}