// const jwt = require('jsonwebtoken');
// const bcrypt = require("bcrypt");
var express = require('express');
var router = express.Router();
// const {User} = require('../schemas/user');

const { authenticateUser, createUser, createToken } = require('../modules/auth');

router.post("/register", async (req, res) => {
  const {code, message} = await createUser(req.body.email, req.body.password);

  console.log(code, message);
  
  res.status(code).send(message);
});

router.post("/login", async (req, res) => {
  const {code, message} = await authenticateUser(req.body.email, req.body.password);
  console.log(code, message);

  if (code == 200) {
    const token = await createToken(req.body.email);

    return res.status(code).json({
      message: message,
      token: token,
    });
  }

  res.status(code).send(message);
});

module.exports = router;
