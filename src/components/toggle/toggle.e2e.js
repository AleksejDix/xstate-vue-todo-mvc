const { Machine } = require("xstate");
const { createModel } = require("@xstate/test");

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
          await page.waitForSelector('[data-test="input"]:checked');
        }
      }
    },
    active: {
      on: {
        TOGGLE: "inactive"
      },
      meta: {
        test: async page => {
          await page.waitForSelector('[data-test="input"]:not(:checked)');
        }
      }
    }
  }
});

const toggleModel = createModel(toggleMachine).withEvents({
  TOGGLE: {
    exec: async page => {
      await page.click('[data-test="input"]');
    }
  }
});

describe("toggle", () => {
  const testPlans = toggleModel.getShortestPathPlans();

  testPlans.forEach(plan => {
    describe(plan.description, () => {
      plan.paths.forEach(path => {
        it(
          path.description,
          async () => {
            await page.goto("http://localhost:8080");
            path.test(page);
          },
          10000
        );
      });
    });
  });
});
