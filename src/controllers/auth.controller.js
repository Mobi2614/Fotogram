const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  authService,
  userService,
  tokenService,
  emailService,
} = require("../services");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const { generateOtp, verifyOtp } = require("../utils/CustomOtp");
const {
  generateResetPasswordToken,
  verifyToken,
} = require("../services/token.service");

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);

  const otp = await generateOtp(req.body.email);
  await emailService.sendVerificationOtpEmail(req.body.email, otp);
  res
    .status(httpStatus.OK)
    .send({ message: `You are registered successfully` });
});

const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.query;
  const tokenVerified = await authService.verifyEmail(token);
  let redirectUrl = config.clientUrl;
  if (tokenVerified && tokenVerified.type == "verifyEmail") {
    const user = await userService.createUser(tokenVerified.sub);
    redirectUrl += `auth/verifyEmail`;
    res.redirect(redirectUrl);
  }
  res.status(200).send({ verified: true });
});

const login = catchAsync(async (req, res) => {
  const { email, password, type, isApp } = req.body;

  const user = await authService.loginUserWithEmailAndPassword(
    email,
    password,
    type
  );
  const tokens = await tokenService.generateAuthTokens(user, isApp);
  res.send({ user, tokens });
});

const logout = async (req, res) => {
  await authService.logout(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
};

const forgotPassword = catchAsync(async (req, res) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d+$/;
  const { recipient } = req.body;
  const otp = await generateOtp(recipient);
  if (phoneRegex.test(recipient)) {
    const user = await userService.getUserByPhoneNumber(recipient);
    if (!user) {
      throw new ApiError("Account not found with this number");
    }
    const message = `OTP: ${otp}`;
    // const data = await sendSms(recipient, message);
  } else if (emailRegex.test(recipient)) {
    const user = await userService.getUserByEmail(recipient);
    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Account not found with this email"
      );
    }
    await emailService.sendVerificationOtpEmail(recipient, otp);
  } else throw new ApiError(httpStatus.BAD_REQUEST, "Invalid recipient found!");

  res.status(httpStatus.OK).send({
    otp,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { token, password } = req.body;
  const user = await verifyToken(token);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, `${type} not found!`);
  }
  await authService.resetPassword(user.sub, password);
  res.status(httpStatus.CREATED).send("Password Reset Successfully");
});

const changePassword = catchAsync(async (req, res) => {
  const user = await userService.changePassword(req.body.userId, req.body);
  res.status(httpStatus.OK).send({
    message: "Password changed successfully",
  });
});
const sendOtp = catchAsync(async (req, res) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d+$/;
  const { recipient } = req.body;
  // await tokenRequestLimiter("sendOtp", recipient);
  const otp = await generateOtp(recipient);
  if (phoneRegex.test(recipient)) {
    const message = `OTP: ${otp}`;
    const data = await sendSms(recipient, message);
  } else if (emailRegex.test(recipient)) {
    await emailService.sendVerificationOtpEmail(recipient, otp);
  } else throw new ApiError(httpStatus.BAD_REQUEST, "Invalid recipient found!");

  res.status(httpStatus.OK).send({
    otp,
  });
});
const verifyUserOtp = catchAsync(async (req, res) => {
  const isValid = await verifyOtp(req.body.otp, req.body.recipient);
  let resObj = { isValid };
  const { recipient, context } = req.body;
  if (isValid) {
    if (context == "register") {
      const user = await userService.updateUserByEmailOrNumber(recipient, {
        isEmailVerified: true,
      });
      const tokens = await tokenService.generateAuthTokens(user);
      resObj["user"] = user;
      resObj["tokens"] = tokens;
    } else if (context == "resetPassword") {
      const token = await generateResetPasswordToken(recipient);
      resObj["token"] = token;
    }
  }
  res.status(httpStatus.OK).send(resObj);
});

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  sendOtp,
  verifyUserOtp,
};
