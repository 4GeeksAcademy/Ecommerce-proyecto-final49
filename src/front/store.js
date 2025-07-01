export const initialStore = () => {
    const token = localStorage.getItem("jwt_token") || null;

    const localCart = JSON.parse(localStorage.getItem("local_cart") || "[]");
    const initialCartCount = localCart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

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
        loading: false,
        cartCount: initialCartCount
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
            localStorage.removeItem("local_cart");
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

        case "SET_LOCAL_CART": {
            const newLocalCart = action.payload;
            const newCartCount = newLocalCart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
            localStorage.setItem("local_cart", JSON.stringify(newLocalCart));
            return { ...store, localCart: newLocalCart, cartCount: newCartCount };
        }
        case "ADD_LOCAL_CART_ITEM": {
            const { product, quantity: selectedQuantity } = action.payload;
            const updatedCart = [...store.localCart];
            const existingItemIndex = updatedCart.findIndex(item => Number(item.product_id) === Number(product.id));

            if (existingItemIndex > -1) {
                updatedCart[existingItemIndex].quantity = Number(updatedCart[existingItemIndex].quantity || 0) + Number(selectedQuantity || 1);
            } else {
                updatedCart.push({
                    product_id: product.id,
                    product_name: product.name,
                    price: product.price,
                    image_url: product.image_url,
                    quantity: Number(selectedQuantity || 1),
                    id: Date.now() + Math.random().toString(36).substring(2, 9) 
                });
            }
            const newCartCount = updatedCart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
            localStorage.setItem("local_cart", JSON.stringify(updatedCart));
            return { ...store, localCart: updatedCart, cartCount: newCartCount };
        }
        case "UPDATE_LOCAL_CART_ITEM": {
            const { productId, newQuantity } = action.payload;
            const updatedCart = store.localCart.map(item => {
                if (Number(item.product_id) === Number(productId)) {
                    return { ...item, quantity: Number(newQuantity) || 1 };
                }
                return item;
            });
            const newCartCount = updatedCart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
            localStorage.setItem("local_cart", JSON.stringify(updatedCart));
            return { ...store, localCart: updatedCart, cartCount: newCartCount };
        }
        case "REMOVE_LOCAL_CART_ITEM": {
            const itemId = action.payload; 
            const updatedCart = store.localCart.filter(item => item.id !== itemId);
            const newCartCount = updatedCart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
            localStorage.setItem("local_cart", JSON.stringify(updatedCart));
            return { ...store, localCart: updatedCart, cartCount: newCartCount };
        }
        case "CLEAR_LOCAL_CART":
            localStorage.removeItem("local_cart");
            return { ...store, localCart: [], cartCount: 0 };

        case "SET_BACKEND_CART": {
            const newBackendCart = action.payload;
            const newCartCount = newBackendCart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
            return { ...store, backendCart: newBackendCart, cartCount: newCartCount };
        }
        
        case "SET_MESSAGE":
            return { ...store, message: action.payload };
        case "SET_LOADING":
            return { ...store, loading: action.payload };

        case "SET_CART_COUNT":
            return { ...store, cartCount: Number(action.payload) || 0 };

        default:
            return store;
    }
}