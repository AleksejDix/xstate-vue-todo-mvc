import { Machine, actions, sendParent } from "xstate";
const { assign } = actions;

export const todoMachine = Machine(
  {
    id: "todo",
    initial: "show",
    context: {
      id: undefined,
      title: "",
      remeberedTodoTitle: ""
    },
    states: {
      show: {
        id: "show",
        initial: "unknown",
        on: {
          DESTROY: "destroyed"
        },
        states: {
          unknown: {
            on: {
              "": [
                {
                  target: "done",
                  cond: "isDone"
                },
                {
                  target: "undone"
                }
              ]
            }
          },
          done: {
            entry: ["doneTodoCreate", "sendParentAboutCommit"],
            on: {
              TOGGLE: "undone"
            }
          },
          undone: {
            entry: ["undoneTodoCreate", "sendParentAboutCommit"],
            on: {
              TOGGLE: "done",
              EDIT: {
                target: "#todo.editing",
                actions: "focusInput"
              }
            }
          },
          hist: {
            type: "history"
          }
        }
      },
      editing: {
        entry: ["rememberedTodoTitleCreate"],
        on: {
          UPDATE: [
            {
              target: "#show.hist",
              cond: "hasTodoTitle",
              actions: ["sendParentAboutCommit"]
            }
          ],
          CANCEL: {
            target: "#show.hist",
            actions: "todoUpdate"
          }
        }
      },
      destroyed: {
        onEntry: ["sendParentAboutDelete"],
        type: "final"
      }
    }
  },
  {
    guards: {
      isDone: ctx => ctx.completed,
      hasTodoTitle: ctx => ctx.title.trim().length > 0
    },
    actions: {
      rememberedTodoTitleCreate: assign({
        remeberedTodoTitle: context => context.title
      }),
      todoUpdate: assign({
        title: ctx => ctx.remeberedTodoTitle,
        remeberedTodoTitle: undefined
      }),
      doneTodoCreate: assign({ completed: true }),
      undoneTodoCreate: assign({ completed: false }),
      sendParentAboutCommit: sendParent(ctx => ({
        type: "TODO.COMMIT",
        todo: ctx
      })),
      sendParentAboutDelete: sendParent(ctx => ({
        type: "TODO.DELETE",
        id: ctx.id
      })),
      log: (c, e) => {
        console.log(c, e);
      }
    }
  }
);

// rememberedTodoTitleCreate
// rememberedTodoTitleDestroy

// todoUpdate

// ## Filters cant be destroyed and updated
// undoneTodoCreate
// doneTodoCreate
