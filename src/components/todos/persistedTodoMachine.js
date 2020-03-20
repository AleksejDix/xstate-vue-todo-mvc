import { todosMachine } from "./todosMachine";

export const persistedTodosMachine = todosMachine.withConfig(
  {
    actions: {
      persist: ctx => {
        localStorage.setItem("todos-xstate", JSON.stringify(ctx.todos));
      }
    }
  },
  // initial state from localstorage
  {
    todo: "Learn state machines",
    todos: (() => {
      try {
        return JSON.parse(localStorage.getItem("todos-xstate")) || [];
      } catch (e) {
        return [];
      }
    })()
  }
);
