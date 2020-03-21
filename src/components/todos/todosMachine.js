import { Machine, assign, spawn } from "xstate";
import uuid from "uuid-v4";
import { todoMachine } from "@/components/todo/todoMachine";

const createTodo = title => {
  return {
    id: uuid(),
    title: title,
    completed: false
  };
};

export const todosMachine = Machine(
  {
    id: "todos",
    context: {
      todo: "",
      todos: []
    },
    initial: "initializing",
    states: {
      initializing: {
        entry: ["setup"],
        on: {
          "": "all"
        }
      },
      all: {},
      active: {},
      completed: {}
    },
    on: {
      todoCreate: {
        actions: ["todoCreate", "persist"],
        cond: "hasTitle"
      },
      UPDATE: {
        actions: ["todoUpdate", "persist"]
      },
      DESTROY: {
        actions: ["todoDestroy", "persist"]
      },
      "SHOW.all": ".all",
      "SHOW.active": ".active",
      "SHOW.completed": ".completed",
      "MARK.done": {
        actions: ["doAll"]
      },
      "MARK.undone": {
        actions: ["undoAll"]
      },
      CLEAR: {
        actions: ["listDestroy"]
      }
    }
  },
  {
    guards: {
      hasTitle: (ctx, e) => e.value.trim().length
    },
    actions: {
      log: (c, e) => {
        console.log(c, e);
      },
      doAll: ctx => {
        ctx.todos.forEach(todo => {
          todo.ref.send("DO");
        });
      },
      undoAll: ctx => {
        ctx.todos.forEach(todo => {
          todo.ref.send("UNDO");
        });
      },
      listDestroy: ctx => {
        ctx.todos.forEach(todo => {
          todo.ref.send("DESTROY");
        });
      },
      todoCreate: assign({
        todo: "", // clear todo
        todos: (ctx, e) => {
          const newTodo = createTodo(e.value.trim());
          return ctx.todos.concat({
            ...newTodo,
            ref: spawn(todoMachine.withContext(newTodo))
          });
        }
      }),
      todoUpdate: assign({
        todos: (ctx, e) =>
          ctx.todos.map(todo => {
            return todo.id === e.todo.id
              ? { ...todo, ...e.todo, ref: todo.ref }
              : todo;
          })
      }),
      todoDestroy: assign({
        todos: (ctx, e) => ctx.todos.filter(todo => todo.id !== e.id)
      }),
      setup: assign({
        todos: ctx =>
          ctx.todos.map(todo => ({
            ...todo,
            ref: spawn(todoMachine.withContext(todo))
          }))
      })
    }
  }
);
