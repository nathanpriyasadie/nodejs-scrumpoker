exports.getChatPage = (req, res, next) => {
  res.render("chat", { path: "/chat" });
};
