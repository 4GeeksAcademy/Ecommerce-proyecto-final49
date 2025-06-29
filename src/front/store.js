// workspaces/ecommerce/src/front/store.js

// Define el estado inicial de nuestra aplicación.
export const initialStore = () => {
    // Intenta cargar el token JWT del localStorage.
    // Usamos "jwt_token" para ser específicos con JWT.
    const token = localStorage.getItem("jwt_token") || null;

    // Carga el carrito local del localStorage. Si no existe, inicializa un array vacío.
    const localCart = JSON.parse(localStorage.getItem("local_cart") || "[]");

    return {
        // --- Tu estado existente ---
        message: null,
        todos: [
            {
                id: 1,
                title: "Make the bed",
                background: null,
            },
            {
                id: 2,
                title: "Do my homework",
                background: null,
            },
        ],
        // Tu token existente, ahora alineado con "jwt_token" para consistencia.
        token: token,
        // Tu campo existente 'me' ahora se llamará 'user' para ser más descriptivo con la información del usuario logueado.
        user: null, // Lo inicializamos a null, y se llenará con la acción ADD_ME

        // --- Nuevas propiedades para el carrito y autenticación ---
        localCart: localCart,       // Carrito para usuarios NO autenticados, cargado desde localStorage
        backendCart: [],            // Carrito para usuarios AUTENTICADOS, se carga del backend
        loading: false              // Para manejar estados de carga globales (opcional)
    };
};

// Este es el "reducer".
export default function storeReducer(store, action = {}) {
    switch (action.type) {
        // --- Acciones de tu código existente ---
        case "set_hello":
            return {
                ...store,
                message: action.payload,
            };

        case "add_task": // Ojo: Este case no tiene un 'return' al final. Asegúrate de que haga algo.
                         // Lo he movido más abajo para evitar conflictos con el 'return' del case 'LOGIN'.
            // const { id, color } = action.payload; // Esto estaba sin usar y debería estar dentro de su propio case.
            // Falta un 'return' aquí. Si esta acción necesita modificar 'todos', debería hacerlo y retornar un nuevo estado.
            // Para el ejemplo, asumo que 'add_task' es un placeholder o está incompleto.
            // Si necesitas usar 'id' y 'color' para 'todos', colócalo dentro de un 'return' aquí.
            // EJEMPLO:
            // return {
            //     ...store,
            //     todos: store.todos.map((todo) =>
            //         todo.id === action.payload.id ? { ...todo, background: action.payload.color } : todo
            //     ),
            // };
            // throw Error("Action 'add_task' not fully implemented or missing return.");
            return store; // Placeholder para que no rompa si no hace nada

        // --- Acciones de Autenticación (fusionadas y ajustadas) ---
        case "LOGIN":
            // Guarda el token en localStorage y actualiza el estado.
            // Asumimos que action.payload para LOGIN ahora es { token, user_data }
            localStorage.setItem("jwt_token", action.payload.token); // Usamos "jwt_token" para consistencia
            return {
                ...store,
                token: action.payload.token,
                user: action.payload.user_data // Ahora usa 'user' en lugar de 'me' para los datos del usuario
            };
        case "LOGOUT":
            // Elimina el token de localStorage y limpia el estado de usuario/token.
            localStorage.removeItem("jwt_token"); // Elimina "jwt_token"
            // También remueve el token "antiguo" si aún existiera por si acaso.
            localStorage.removeItem("token");
            return {
                ...store,
                token: null,
                user: null,             // Limpia la información del usuario
                backendCart: [],        // Limpia el carrito del backend
                localCart: []           // Opcional: limpiar el carrito local al desloguear
            };
        
        // --- Tu acción ADD_ME existente (renombrada para ser más descriptiva con 'user') ---
        case "ADD_ME": // Esta acción ahora actualiza el campo 'user'
            return {
                ...store,
                user: action.payload, // Guarda la info detallada del usuario en 'user'
            };

        // --- Nuevas acciones para el Carrito Local (para usuarios NO autenticados) ---
        case "SET_LOCAL_CART":
            return { ...store, localCart: action.payload };
        case "ADD_LOCAL_CART_ITEM": {
            const product = action.payload;
            const updatedCart = [...store.localCart];
            // Busca si el producto ya existe por su product_id.
            const existingItemIndex = updatedCart.findIndex(item => item.product_id === product.id);

            if (existingItemIndex > -1) {
                updatedCart[existingItemIndex].quantity += 1;
            } else {
                updatedCart.push({
                    product_id: product.id,
                    product_name: product.name,
                    price: product.price,
                    image_url: product.image_url,
                    quantity: 1,
                    // ID temporal para el frontend, ¡CRÍTICO para las 'keys' en React!
                    id: Date.now() + Math.random().toString(36).substring(2, 9) 
                });
            }
            localStorage.setItem("local_cart", JSON.stringify(updatedCart));
            return { ...store, localCart: updatedCart };
        }
        case "REMOVE_LOCAL_CART_ITEM": {
            // Usa el 'id' generado por el frontend para remover.
            const itemId = action.payload; 
            const updatedCart = store.localCart.filter(item => item.id !== itemId);

            localStorage.setItem("local_cart", JSON.stringify(updatedCart));
            return { ...store, localCart: updatedCart };
        }
        case "CLEAR_LOCAL_CART":
            localStorage.removeItem("local_cart");
            return { ...store, localCart: [] };

        // --- Nuevas acciones para el Carrito del Backend (para usuarios AUTENTICADOS) ---
        case "SET_BACKEND_CART":
            return { ...store, backendCart: action.payload };

        // --- Acciones Generales (nuevas, si se usan en useGlobalReducer) ---
        case "SET_MESSAGE": // Tu acción 'set_hello' se puede unificar con esta para mensajes generales.
            return { ...store, message: action.payload };
        case "SET_LOADING":
            return { ...store, loading: action.payload };

        default:
            // Si la acción no se reconoce, devuelve el estado sin cambios.
            // Evitamos 'throw Error' en el default, es mejor solo retornar el estado.
            return store;
    }
}