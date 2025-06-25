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

    case "LOGIN":
      return {
        ...store,
        token: action.payload,
      };
    case "LOGOUT":
      return {
        ...store,
        token: localStorage.getItem("token") || null,
      };
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };

    case "ADD_ME":
      return {
        ...store,
        me: action.payload,
      };
    default:
      throw Error("Unknown action.");
  }
}
