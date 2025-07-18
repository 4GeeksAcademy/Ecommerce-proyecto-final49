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
          const resp = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            }
          );

          const data = await resp.json();
          console.log("Línea 29 - Respuesta del backend:", data);

          if (resp.ok && data.token) {
            localStorage.setItem("jwt_token", data.token);
            dispatch({
              type: "LOGIN",
              payload: { token: data.token, user_data: data.user },
            });
            return true;
          } else {
            console.error("Error de login:", data.msg || "No token recibido");
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

      getUserInfo: async () => {
        console.log("Este es el token en getUserInfo antes del const token:", localStorage.getItem("jwt_token"))
        // Código nuevo para hacer pruebas para que mantenga el token 06JUL (1) ***
        const token = localStorage.getItem("jwt_token");
        console.log("Este es el token en getUserInfo después del const token:", localStorage.getItem("jwt_token"));

        // const token = localStorage.getItem("jwt_token");

        if (!token || token === "null" || token === "undefined") {
          console.warn("Token inválido o ausente en getUserInfo.");
          return false;
        }
        // Fin código nuevo para hacer pruebas para que mantenga el token 06JUL (1) ***

        // const token = tokenArg || localStorage.getItem("jwt_token");

        // // if (!token || token === "null" || token === "undefined") {
        // if (!token) {
        //   console.warn("Token inválido o ausente en getUserInfo.");
        //   return false;
        // }

        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log(response);

          if (!response.ok) { 
            console.log(response);

          }
          const data = await response.json();
          dispatch({ type: "ADD_ME", payload: data });
          return true;
        } catch (error) {
          console.error("Error al obtener información del usuario:", error);
          // allActions.logout();
          return false;
        }
      },
      // FIN CODIGO ORIGINAL

      addToCart: async (product, quantity = 1) => {
        const token = store.token || localStorage.getItem("jwt_token");
        if (token && store.user) {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/cart`,
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
          dispatch({
            type: "ADD_LOCAL_CART_ITEM",
            payload: { product, quantity },
          });
          return true;
        }
      },

      removeCartItem: async (itemId) => {
        const token = store.token || localStorage.getItem("jwt_token");
        if (token && store.user) {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/cart/${itemId}`,
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
              `${import.meta.env.VITE_BACKEND_URL}/cart/clear`,
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
            `${import.meta.env.VITE_BACKEND_URL}/cart`,
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
            `${import.meta.env.VITE_BACKEND_URL}/cart`,
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

  // Código original comentado para hacer pruebas 06JUL ***
  // useEffect(() => {
  //   console.log("Este es el segundo useEffect, y trae el valor de token:", localStorage.getItem("jwt_token"))
  //   const token = localStorage.getItem("jwt_token");
  //   if (token && !store.token) {
  //     dispatch({ type: "LOGIN", payload: { token: token, user_data: null } });
  //   }
  //   if (store.token) {
  //     actions.getUserInfo(store.token);
  //   } else {
  //     dispatch({ type: "ADD_ME", payload: null });
  //   }
  // }, [store.token, actions]);
  // Fin código original comentado para hacer pruebas 06JUL ***

  // Código de prueba ***
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    console.log("useEffect inicial, token encontrado:", token);
    if (token && token !== "null" && token !== "undefined") {
      dispatch({ type: "UPDATE_TOKEN", payload: token });
    }
  }, []);
  // Fin código de prueba ***

  // Código original comentado para hacer pruebas 06JUL ***
  // useEffect(() => {
    
  //   if (actions) {
  //     actions.getUserInfo();
  //     actions.syncLocalCartWithStore();
  //   }
  // }, []);
  // Fin código original comentado para hacer pruebas 06JUL ***

  // Código nuevo para hacer pruebas para que mantenga el token 07JUL (4) ***
    useEffect(() => {
      if (store.token) {
        console.log("Token presente en el store. Obteniendo info del usuario...");
        actions.getUserInfo();
      } else {
        dispatch({ type: "ADD_ME", payload: null });
      }

      actions.syncLocalCartWithStore();
    }, [store.token]);
  // Fin código nuevo para hacer pruebas para que mantenga el token 07JUL (4) ***

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
