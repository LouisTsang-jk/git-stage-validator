interface Pool<T, U> {
  concurrency: number
  tasks: T[],
  fn: (task: T, index: number) => Promise<U>
}

export async function pool<T, U> ({
  concurrency,
  tasks,
  fn
}: Pool<T, U>) {
  const queue = []
  const executing: Promise<U>[] = []
  for (const [index, task] of tasks.entries()) {
    const p = Promise.resolve().then(() => fn(task, index))
    queue.push(p)
    if (concurrency <= tasks.length) {
      const e: Promise<U> = p.then(() => executing.splice(executing.indexOf(e), 1)) as Promise<U>
      executing.push(e)
      if (executing.length >= concurrency) {
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(queue)
}
