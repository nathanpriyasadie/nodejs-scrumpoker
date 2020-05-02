const tasks = [];

const addTask = (task) => {
  const index = tasks.findIndex((task) => task.room === task.room);
  if (index === -1 || !tasks.length) {
    tasks.push(task);
  } else {
    tasks[index] = task;
  }
  console.log("Tasks List", tasks);
  return task;
};

module.exports = { addTask };
