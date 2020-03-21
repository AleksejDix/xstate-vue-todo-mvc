import { Machine, actions, sendParent } from "xstate";
const { assign } = actions;

export const todoMachine = Machine(
  {
    id: "todo",
    initial: "show",
    context: {
      id: undefined,
      title: "",
      titleBackup: ""
    },
    on: {
      DO: {
        target: ".show.done"
      },
      UNDO: {
        target: ".show.undone"
      },
      DESTROY: {
        target: "destroyed"
      }
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
            entry: ["doneTodoCreate", "emitUpdate"],
            on: {
              TOGGLE: "undone"
            }
          },
          undone: {
            entry: ["undoneTodoCreate", "emitUpdate"],
            on: {
              TOGGLE: "done",
              EDIT: "#todo.editing"
            }
          },
          hist: {
            type: "history"
          }
        }
      },
      editing: {
        entry: ["titleBackupCreate", "focusInput"],
        on: {
          UPDATE: [
            {
              cond: "isEmpty",
              target: "destroyed"
            },
            {
              target: "#show.hist"
            }
          ],
          CANCEL: {
            target: "#show.hist",
            actions: ["titleUpdate", "titleBackupDestroy"]
          }
        }
      },
      destroyed: {
        onEntry: ["emitDelete"],
        type: "final"
      }
    }
  },
  {
    guards: {
      isDone: ctx => ctx.completed,
      isEmpty: ctx => !ctx.title.trim()
    },
    actions: {
      titleUpdate: assign({ title: ctx => ctx.titleBackup }),
      titleBackupCreate: assign({ titleBackup: ({ title }) => title }),
      titleBackupDestroy: assign({ titleBackup: undefined }),
      doneTodoCreate: assign({ completed: true }),
      undoneTodoCreate: assign({ completed: false }),
      emitUpdate: sendParent(ctx => ({
        type: "UPDATE",
        todo: ctx
      })),
      emitDelete: sendParent(ctx => ({
        type: "DESTROY",
        id: ctx.id
      })),
      log: (c, e) => {
        console.log(c, e);
      }
    }
  }
);

// titleBackupCreate
// rememberedTodoTitleDestroy

// titleBackupDestroy

// ## Filters cant be destroyed and updated
// undoneTodoCreate
// doneTodoCreate
