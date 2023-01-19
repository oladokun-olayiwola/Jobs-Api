const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const BadRequestError = require("../errors/badRequests");
const {unAuthenticatedError} = require("../errors");

const register = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide a email and a password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new unAuthenticatedError("Please create an account");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new unAuthenticatedError('Invalid Credentials');
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { login, register };
