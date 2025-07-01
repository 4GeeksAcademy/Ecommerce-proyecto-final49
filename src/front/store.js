export const initialStore = () => {
    const token = localStorage.getItem("jwt_token") || null;

    const localCart = JSON.parse(localStorage.getItem("local_cart") || "[]");
    const initialCartCount = localCart.reduce((sum, item) => sum + item.quantity, 0);

    return {
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
        token: token,
        user: null,

        localCart: localCart,
        backendCart: [],
        loading: false
    };
};

export default function storeReducer(store, action = {}) {
    switch (action.type) {
        case "set_hello":
            return {
                ...store,
                message: action.payload,
            };

        case "add_task":

            return store;

        case "LOGIN":
            localStorage.setItem("jwt_token", action.payload.token);
            return {
                ...store,
                token: action.payload.token,
                user: action.payload.user_data
            };
        case "LOGOUT":
            localStorage.removeItem("jwt_token");
            localStorage.removeItem("token");
            return {
                ...store,
                token: null,
                user: null, 
                backendCart: [],
                localCart: [],
                cartCount: 0,
            };
        
        case "ADD_ME":
            return {
                ...store,
                user: action.payload,
            };

        case "SET_LOCAL_CART":
            return { ...store, localCart: action.payload };
        case "ADD_LOCAL_CART_ITEM": {
            const product = action.payload;
            const updatedCart = [...store.localCart];
            const existingItemIndex = updatedCart.findIndex(item => item.product_id === product.id);

            if (existingItemIndex > -1) {
                updatedCart[existingItemIndex].quantity += product.quantity || 1;
            } else {
                updatedCart.push({
                    product_id: product.id,
                    product_name: product.name,
                    price: product.price,
                    image_url: product.image_url,
                    quantity: 1,
                    id: Date.now() + Math.random().toString(36).substring(2, 9) 
                });
            }
            localStorage.setItem("local_cart", JSON.stringify(updatedCart));
            return { ...store, localCart: updatedCart };
        }
        case "REMOVE_LOCAL_CART_ITEM": {
            const itemId = action.payload; 
            const updatedCart = store.localCart.filter(item => item.id !== itemId);

            localStorage.setItem("local_cart", JSON.stringify(updatedCart));
            return { ...store, localCart: updatedCart };
        }
        case "CLEAR_LOCAL_CART":
            localStorage.removeItem("local_cart");
            return { ...store, localCart: [] };

        case "SET_BACKEND_CART":
            return { ...store, backendCart: action.payload };

        case "SET_MESSAGE":
            return { ...store, message: action.payload };
        case "SET_LOADING":
            return { ...store, loading: action.payload };

        default:
            return store;
    }
}