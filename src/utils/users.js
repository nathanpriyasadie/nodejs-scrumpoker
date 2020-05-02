const users = [];

const addUser = ({ id, username, room, role }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return {
      error: "Username is in use",
    };
  }
  const user = { id, username, room, role, message: null };
  users.push(user);
  return { user };
};

const getUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return { user: users[index] };
  }
  return { error: "user not found" };
};

const getAdmin = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (users[index].role === "admin") {
    return { user: users[index] };
  }
  return { error: "user is not admin" };
};

const setMessage = (data) => {
  const index = users.findIndex((item) => item.id === data.id);
  if (index === -1 || !users.length) {
    console.log("error", data);
  } else {
    users[index].message = data.message;
  }
  return users;
};

const getUsers = (room) => {
  return users.filter((user) => user.room === room);
};

const resetMessage = (room) => {
  users.map((user) => {
    if (user.room === room) user.message = null;
  });
};

const getUsersWithoutMessage = (room) => {
  const newUsers = users.map(({ message, ...keepAttrs }) => keepAttrs);

  return newUsers.filter((user) => user.room === room);
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  users.splice(index, 1);
};

// addUser({
//   id: 1,
//   username: "nathan",
//   room: "1",
//   role: "admin",
// });
// setMessage({ id: 1, message: "halo" });

module.exports = {
  addUser,
  getUser,
  getAdmin,
  setMessage,
  getUsers,
  getUsersWithoutMessage,
  removeUser,
  resetMessage,
};
