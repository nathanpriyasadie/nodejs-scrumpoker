const path = require("path");
const express = require("express");

const router = express.Router();

exports.getLoginPage = (req, res) => {
  res.render("login", { path: "/" });
};
