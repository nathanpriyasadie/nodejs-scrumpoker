const socket = io();

const params = window.location.search;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const roomParam = urlParams.get("room");
const usernameParam = urlParams.get("username").toLowerCase();
const roleParam = urlParams.get("role").toLowerCase();

const $messageForm = document.querySelector("#message-form");
const $taskForm = document.querySelector("#task-form");
const $revealButton = document.querySelector("#reveal-button");
const $task = document.querySelector("#task");
const $title = document.querySelector("#title");
const $user = document.querySelector("#user");
//template
const taskTemplate = document.querySelector("#task-template").innerHTML;
const userTemplate = document.querySelector("#user-template").innerHTML;

$title.innerHTML = `Welcome ${usernameParam} to room ${roomParam}`;
if (roleParam === "user") {
  $revealButton.style.display = "none";
  $taskForm.style.display = "none";
} else {
  $messageForm.style.display = "none";
}

// Options
const { username, room, role } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("user", (users) => {
  const html = Mustache.render(userTemplate, {
    users,
  });
  $user.innerHTML = html;
});

socket.on("task", (data) => {
  const html = Mustache.render(taskTemplate, {
    task: data.task,
  });
  $task.innerHTML = html;
});

socket.emit("join", { username, room, role }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit("message", message);
});

$taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = e.target.elements.message.value;
  e.target.elements.message.value = "";
  socket.emit("task", task);
});

$revealButton.addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("reveal");
});
