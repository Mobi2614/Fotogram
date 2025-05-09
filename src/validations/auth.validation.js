const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const register = {
  body: Joi.object({
    role: Joi.string().valid("consumer", "creator").required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .trim()
      .min(8)
      .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*\\d).+$"))
      .message(
        "Password must be 8 characters with at least 1 number and 1 letter"
      )
      .required(),
    phoneNo: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    recipient: Joi.string().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    token: Joi.string().required(),
  }),
};

const sendOtp = {
  body: Joi.object().keys({
    recipient: Joi.string().required(),
  }),
};

const verifyOtp = {
  body: Joi.object().keys({
    recipient: Joi.string().required(),
    otp: Joi.string().required(),
    type: Joi.string().valid("consumer", "creator").required(),
    context: Joi.string().valid("register", "resetPassword").required(),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
    group: Joi.string(),
  }),
};
const changePassword = {
  body: Joi.object().keys({
    userId: Joi.custom(objectId),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  changePassword,
  sendOtp,
  verifyOtp,
};
