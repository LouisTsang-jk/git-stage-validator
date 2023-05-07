import { pool } from "../src/pool";

const sleep = (i: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(i);
    }, i);
  });

describe("pool function", () => {
  it("should process tasks with correct concurrency", async () => {
    const tasks = [100, 50, 150, 200, 75, 125];
    const concurrency = 2;
    const results = await pool({
      concurrency,
      tasks,
      fn: sleep,
    });
    expect(results).toEqual([100, 50, 150, 200, 75, 125]);
  });
});
