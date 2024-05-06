const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
var express = require('express');
var router = express.Router();
const {User} = require('../schemas/user');

router.post("/register", async (req, res) => {
  // SANITIZE FROM OTHER SYMBOLS
  const sanitizedEmail = req.body.email.replace(/[$\.]/g, '');
  const sanitizedPassword = req.body.password.replace(/[$\.]/g, '');

  // DEMONSTRATION
  console.log("Sanitized data: " + sanitizedEmail, sanitizedPassword);

  // Check if user exists
  const isBusy = await User.findOne({ email: sanitizedEmail });
  if (isBusy) {
    res.status(400).send("Логин зайнит");
    return;
    // throw new Error("");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(sanitizedPassword, salt);

  // Create user
  const user = await User.create({
    email: sanitizedEmail,
    password: newPassword,
  });
  if (user) {
    res.status(201).json({
      message: "Пользователь создан",
      status: "Успешно",
    });
  } else {
    res.status(400).send("Пользователь не создан");
  }
});

router.post("/login", async (req, res) => {
  // SANITIZE FROM OTHER SYMBOLS
  const sanitizedEmail = req.body.email.replace(/[$\.]/g, '');
  const sanitizedPassword = req.body.password.replace(/[$\.]/g, '');

  // DEMONSTRATION
  console.log("Sanitized data: " + sanitizedEmail, sanitizedPassword);

  // Check if user exists
  const user = await User.findOne({ email: sanitizedEmail });
  if (!user) {
    res.status(400).send("Пользователя нету в базе");
    return;
  }
  if (user && bcrypt.compareSync(sanitizedPassword, user.password)) {
    res.status(200).json({
      message: "Пользователь залогинился",
      status: "Успшно",
      token: generateToken(user._id),
    });
  } else {
    res.status(400).send("Неверные данные. Bad request");
  }
});

//Generate JWT for the user
const generateToken = (id) => {
  return jwt.sign({ id }, "qwerty", {
    expiresIn: "7d",
  });
};

module.exports = router;