describe("Todo App", () => {
  it("can be tested with jest and puppeteer", () => {
    page.waitForSelector("todoapp").then(async () => {
      const count = await page.$eval("h1", e => e.innerHTML);
      expect(count).toBe("todos");
    });
  });
});
