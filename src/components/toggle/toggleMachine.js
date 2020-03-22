const { Machine } = require("xstate");
const toggleMachine = Machine({
  id: "toggle",
  initial: "inactive",
  states: {
    inactive: {
      on: {
        TOGGLE: "active"
      },
      meta: {
        test: async page => {
          await page.waitFor(".testinput:checked");
        }
      }
    },
    active: {
      on: {
        TOGGLE: "inactive"
      },
      meta: {
        test: async page => {
          await page.waitFor(".testinput:not(:checked)");
        }
      }
    }
  }
});

export default toggleMachine;
