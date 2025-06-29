export const initialStore = () => {
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
    token: localStorage.getItem("token") || null,
    me: "",
    cartCount: 0,
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
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };

    case "LOGIN":
      return {
        ...store,
        token: action.payload,
      };

    case "LOGOUT":
      localStorage.removeItem("token"); 
      return {
        ...store,
        token: null, 
        me: "", 
        cartCount: 0, 
      };

    case "ADD_ME":
      return {
        ...store,
        me: action.payload,
      };
      case "ADD_TO_CART":
        return {
            ...store,
            cartCount: store.cartCount + 1
      };
      case "RESET_CART":
        return {
            ...store,
            cartCount: 0
        };

    default:
      return store;
  }
}
