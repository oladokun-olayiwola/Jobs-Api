const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {unAuthenticatedError} = require("../errors");

const Authentication = (req, res, next) => {
  const authKey = req.headers.authorization;
  try {
    if (!authKey || !authKey.startsWith("Bearer ")) {
      throw new unAuthenticatedError("Access Unauthorized ");
    }
    const token = authKey.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, name } = decoded;
    req.user = { id, name };
    next();
  } catch (error) {
    throw new unAuthenticatedError("Authentication invalid");
  }
};

module.exports = Authentication;
