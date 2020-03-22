const { Machine } = require("xstate");
const { createModel } = require("@xstate/test");
jest.setTimeout(20000);

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
          const selector = await page.waitFor('[data-test="input"]:checked');
          return page.$(selector);
        }
      }
    },
    active: {
      on: {
        TOGGLE: "inactive"
      },
      meta: {
        test: async page => {
          const selector = await page.waitFor(
            '[data-test="input"]:not(:checked)'
          );
          return page.$(selector);
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
            await page.goto("http://localhost:8085");

            await path.test(page);
          },
          10000
        );
      });
    });
  });

  // it("should have full coverage", () => {
  //   return toggleModel.testCoverage();
  // });
});
